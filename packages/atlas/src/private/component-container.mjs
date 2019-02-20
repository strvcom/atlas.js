import {
  FrameworkError,
  ValidationError,
} from '@atlas.js/errors'
import {
  defaultsDeep as defaults,
  difference,
} from 'lodash'
import dispatch from './dispatch'

/**
 * This class holds and manages a component
 *
 * @private
 */
class ComponentContainer {
  /**
   * Is this component already started?
   * @type    {Boolean}
   */
  started = false

  instance = null

  #observers = new Map()
  #catalog = new Map()

  /**
   * Create new container for a component
   *
   * @param     {Object}        info              Component information
   * @param     {String}        info.type         The component's type (service, hook, action)
   * @param     {String}        info.alias        The component's user-specified name/alias
   * @param     {Object}        info.aliases      Binding information from the user to locate other
   *                                              components
   * @param     {Class}         info.Component    The component class
   * @param     {Object}        info.config       The component's user-specified configuration
   * @param     {Ajv}           info.validator    A JSON schema validator instance
   * @param     {Atlas}         atlas             The Atlas instance
   */
  constructor(info, atlas) {
    this.type = info.type
    this.alias = info.alias
    this.aliases = info.aliases || {}
    this.Component = info.Component

    if (typeof this.Component !== 'function') {
      const type = typeof this.Component
      throw new FrameworkError(`Component ${this.type}:${this.alias} must be class, not ${type}`)
    }

    // Check if the component received all the aliases it requires
    const aliases = {
      provided: Object.keys(this.aliases),
      // Copy the contents to avoid their future modification
      required: [...this.Component.requires || []],
    }

    if (this.type === 'hook') {
      // Require observed components to be resolved via alias
      if (typeof this.Component.observes === 'string') {
        aliases.required.push(this.Component.observes)
      }

      // Do not require atlas to be listed in aliases - we can resolve it automatically
      if (this.Component.observes === 'atlas') {
        aliases.provided.push('atlas')
      }
    }

    const missing = difference(aliases.required, aliases.provided)
    const extra = difference(aliases.provided, aliases.required)

    if (missing.length) {
      throw new FrameworkError(`Missing aliases for component ${this.alias}: ${missing.join(', ')}`)
    }

    if (extra.length) {
      throw new FrameworkError(`Unneeded aliases for component ${this.alias}: ${extra.join(', ')}`)
    }

    const config = defaults(info.config, this.Component.defaults)

    if (!info.validator.validate(info.Component.config, config)) {
      throw new ValidationError(info.validator.errors, {
        alias: this.alias,
        schema: info.Component.config,
        config,
      })
    }

    atlas.log.trace({
      component: this.alias,
      config: info.config,
      defaults: this.Component.defaults,
    }, 'component:config')

    this.component = new this.Component({
      atlas,
      config,
      log: atlas.log.child({ [this.type]: this.alias }),
      dispatch: this.#observers::dispatch,
      component: name => {
        if (!this.#catalog.has(name)) {
          throw new FrameworkError(`Alias for ${name} not defined`)
        }

        return this.#catalog.get(name).instance
      },
    })
  }

  /**
   * Prepare the component
   *
   * @param     {Object}          options           Input options
   * @param     {Object}          options.catalog   Atlas catalog of all components
   * @param     {Map}             options.hooks     Hooks available in the application
   * @return    {Promise<this>}
   */
  async prepare(options) {
    this::mkcatalog(this.#catalog, options)
    this::mkobservers(this.#observers, { hooks: options.hooks })

    switch (this.type) {
      case 'service': {
        this.component.log.trace('prepare:before')
        this.instance = await this.component.prepare()
        await this.#observers::dispatch('afterPrepare', this.instance)
        this.component.log.trace('prepare:after')
        break
      }
      case 'hook':
      case 'action':
      default:
        this.instance = this.component
        break
    }

    return this.instance
  }

  /**
   * Start the component
   *
   * @return    {Promise<this.component>}
   */
  async start() {
    if (this.started) {
      return this.component
    }

    this.component.log.trace('start:before')

    switch (this.type) {
      case 'service':
        await (async () => {
          await this.#observers::dispatch('beforeStart', this.instance)
          await this.component.start(this.instance)
          await this.#observers::dispatch('afterStart', this.instance)
        })()
          .catch(err => {
            this.component.log.error({ err }, 'start:failure')
            throw err
          })
        break

      case 'hook':
      case 'action':
      default:
        break
    }

    this.component.log.trace('start:after')
    this.started = true

    return this.component
  }

  /**
   * Stop this component and clean up all associated resources
   *
   * @return    {Promise<void>}
   */
  async stop() {
    if (!this.started) {
      return
    }

    this.component.log.trace('stop:before')

    switch (this.type) {
      case 'service':
        await (async () => {
          await this.#observers::dispatch('beforeStop', this.instance)
          await this.component.stop(this.instance)
          await this.#observers::dispatch('afterStop', null)
        })()
          .catch(err => {
            this.component.log.error({ err }, 'stop:failure')
            this.started = true
            throw err
          })
        break

      case 'hook':
      case 'action':
      default:
        break
    }

    this.#observers.clear()
    this.#catalog.clear()
    this.instance = null
    this.started = false
  }
}

/**
 * Find all hooks which want to observe this component's events
 *
 * @private
 * @param     {Map}         observers     The observers to check
 * @param     {Object}      opts          Function parameters
 * @param     {Map}         opts.hooks    All hooks known to Atlas
 * @return    {void}
 */
function mkobservers(observers, { hooks }) {
  for (const [alias, container] of hooks || new Map()) {
    const target = container.aliases[container.Component.observes]

    if (this.alias === target) {
      observers.set(alias, container)
    }
  }
}

function mkcatalog(destination, { catalog }) {
  for (const [alias, resolved] of Object.entries(this.aliases)) {
    const [type] = alias.split(':')
    const source = (() => {
      switch (type) {
        case 'service': return catalog.services
        case 'action': return catalog.actions
        default: throw new FrameworkError(`Invalid component type: ${type} used in alias ${alias}`)
      }
    })()

    const dependency = source.get(this.aliases[alias])

    if (!dependency) {
      throw new FrameworkError(`Unable to find ${type} ${resolved} aliased as ${alias}`)
    }

    destination.set(alias, dependency)
  }
}

export default ComponentContainer
