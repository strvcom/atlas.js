// We use for-await pattern quite extensively here for legitimate purposes
/* eslint-disable no-await-in-loop */

import * as path from 'path'
import * as Ajv from 'ajv'
import * as ajvKeywords from 'ajv-keywords'
import * as pino from 'pino'
import {
  defaultsDeep as defaults,
  isPlainObject,
} from 'lodash'
import { FrameworkError } from '@atlas.js/errors'
import {
  expose,
  dispatch,
  component,
  mkconfig,
  mklog,
  optrequire,
} from './private'

/**
 * This class represents your application and aggregates all components together
 *
 * You should generally create only one instance of this class in a program.
 */
class Atlas {
  static defaults = {
    log: {
      name: path.basename(process.cwd()),
      level: 'info',
      serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
    },

    validator: {
      allErrors: true,
      useDefaults: true,
      keywords: [
        'typeof',
      ],
    },
  }

  /**
   * Initialise a brand-new atlas instance from the given module locations
   *
   * Use this method to quickly configure Atlas instance by simply telling it where your components
   * live on the filesystem, and Atlas will load them from the given module locations and add them
   * to the Atlas instance.
   *
   * @param     {Object}      options                       Configuration options
   * @param     {String}      options.env                   The environment under which to operate
   * @param     {String}      options.root                  The root directory to which all other
   *                                                        directories mentioned here are relative
   * @param     {String}      options.config='config'       Module location for the configuration
   * @param     {String}      options.hooks='hooks'         Module location for the hooks
   * @param     {String}      options.services='services'   Module location for the services
   * @param     {String}      options.actions='actions'     Module location for the actions
   * @param     {String}      options.aliases='aliases'     Module location for the aliases
   * @return    {Atlas}
   */
  static init(options = {}) {
    defaults(options, {
      config: 'config',
      hooks: 'hooks',
      services: 'services',
      actions: 'actions',
      aliases: 'aliases',
    })

    const atlas = new this({
      env: options.env,
      root: options.root,
      config: options.config,
    })
    const types = [
      'hooks',
      'services',
      'actions',
      'aliases',
    ]
    const paths = {}
    const modules = {}

    for (const type of types) {
      paths[type] = path.resolve(options.root, options[type])
      modules[type] = atlas.require(options[type], { optional: true })
    }

    atlas.log.debug({ paths }, 'atlas:init')

    return this.bootstrap(atlas, modules)
  }

  /**
   * Bootstrap the given Atlas instance with the provided modules
   *
   * Use this method to quickly set up the given Atlas instance to use the provided components. This
   * is useful if you need to have multiple entry points to your program and some entrypoints should
   * only use some components available. This is especially useful when implementing worker
   * processes where you only need a subset of all available components. This method, while more
   * verbose as Atlas.init(), still frees you from manually adding all the components by hand while
   * providing greater flexibility as to which components will be used.
   *
   * @param     {Atlas}   atlas                 The Atlas instance to bootstrap
   * @param     {Object}  modules?              All the modules which should be added to Atlas
   * @param     {Object}  modules.actions       Actions to add
   * @param     {Object}  modules.hooks         Hooks to add
   * @param     {Object}  modules.services      Services to add
   * @param     {Object}  modules.aliases       Aliases for all the components
   * @return    {Atlas}                         The Atlas instance with all components added, ready
   *                                            to be started
   */
  static bootstrap(atlas, modules = {}) {
    defaults(modules, {
      // config module is loaded by Atlas instance itself, so it's okay to use a string here and let
      // Atlas load it
      config: 'config',
      // The following modules must already be provided directly as we won't load them
      actions: {},
      hooks: {},
      services: {},
      aliases: {
        actions: {},
        hooks: {},
        services: {},
      },
    })

    atlas.log.debug({
      env: atlas.env,
      root: atlas.root,
      components: {
        actions: Object.keys(modules.actions),
        hooks: Object.keys(modules.hooks),
        services: Object.keys(modules.services),
      },
    }, 'atlas:bootstrap')

    // Hooks
    for (const [alias, Hook] of Object.entries(modules.hooks)) {
      const aliases = modules.aliases.hooks[alias]
      atlas.hook(alias, Hook, { aliases })
    }

    // Services
    for (const [alias, Service] of Object.entries(modules.services)) {
      const aliases = modules.aliases.services[alias]
      atlas.service(alias, Service, { aliases })
    }

    // Actions
    for (const [alias, Action] of Object.entries(modules.actions)) {
      const aliases = modules.aliases.actions[alias]
      atlas.action(alias, Action, { aliases })
    }

    return atlas
  }


  /**
   * The current environment under which this instance operates
   *
   * Defaults to NODE_ENV from the environment.
   *
   * @readonly
   * @return    {String}
   */
  get env() {
    return this.#env
  }

  /**
   * The root folder where all other paths should be relative to
   *
   * It is recommended that you set this to the project's root directory.
   *
   * @readonly
   * @return    {String}
   */
  get root() {
    return this.#root
  }

  /**
   * Is this instance in a prepared state?
   *
   * @readonly
   * @return    {boolean}
   */
  get prepared() {
    return this.#prepared
  }

  /**
   * Is this instance in a started state?
   *
   * @readonly
   * @return    {boolean}
   */
  get started() {
    return this.#started
  }

  /**
   * Atlas configuration, as passed in to the constructor
   *
   * @type    {Object}
   */
  config = {}

  /**
   * All services added to this instance
   *
   * @type    {Object}
   */
  services = {}

  /**
   * All actions added to this instance
   *
   * @type    {Object}
   */
  actions = {}

  #env = null
  #root = null
  #prepared = false
  #started = false
  #catalog = {
    services: new Map(),
    hooks: new Map(),
    actions: new Map(),
  }

  #observers = new Map()

  /**
   * An instance of Ajv used to validate component configuration
   * @type    {Ajv}
   */
  validator = null

  /**
   * Create a new instance
   *
   * @param     {Object}    options             Options for the instance
   * @param     {Object}    options.config      Configuration object for the instance and for all
   *                                            services or other components which will be added to
   *                                            the instance
   * @param     {String}    options.root        The root directory of the instance
   * @param     {String}    options.env         The environment under which this instance operates.
   *                                            Components may use this value for various purposes.
   *                                            Defaults to NODE_ENV.
   */
  constructor(options = {}) {
    // Initialise private stuff
    // eslint-disable-next-line no-process-env
    this.#env = options.env || process.env.NODE_ENV
    this.#root = options.root

    // Safety checks
    if (!this.#env) {
      throw new FrameworkError('env not specified and NODE_ENV was not set')
    }

    if (typeof this.root !== 'string') {
      throw new FrameworkError(`root must be explicitly specified, got ${options.root}`)
    }

    this.config = this::mkconfig(options.config, {
      atlas: Atlas.defaults,
      services: {},
      hooks: {},
      actions: {},
    })
    // Logger 🌲
    this.log = this::mklog(this.config.atlas.log)
    // Ajv validator ✓
    this.validator = new Ajv(this.config.atlas.validator)
    ajvKeywords(this.validator, this.config.atlas.validator.keywords)
  }

  /**
   * Require a module by path, relative to the project root
   *
   * @param     {String}    location          The module's location, relative to root
   * @param     {Object}    options?          Options
   * @param     {Boolean}   options.optional  If true, will not throw if the module does not exist
   * @param     {Boolean}   options.normalise If true, it will prefer the ES modules' default export
   *                                          over named exports or the CommonJS exports
   * @param     {Boolean}   options.absolute  If true, will try to load the module without
   *                                          resolving the module's name to the project root (it
   *                                          will load the module using standard Node's mechanism)
   * @return    {mixed}                       The module's contents
   */
  require(location, options = {}) {
    location = options.absolute
      ? location
      : path.resolve(this.root, location)

    const load = options.optional
      ? optrequire
      : require
    const contents = load(location)

    return options.normalise && isPlainObject(contents.default)
      ? contents.default
      : contents
  }

  /**
   * Register a service into this instance of Atlas with the given alias
   *
   * @param     {String}    alias           The alias for the service - it will be used for exposing
   *                                        the service's API on the atlas.services object and for
   *                                        passing configuration data to it
   * @param     {class}     Component       The service class
   * @param     {Object}    opts            Runtime options for the service
   * @param     {Object}    opts.aliases    Bindings to other defined components
   * @return    {this}
   */
  service(alias, Component, opts = {}) {
    this::component({
      type: 'service',
      alias,
      Component,
      aliases: opts.aliases,
    }, this.#catalog.services)

    return this
  }

  /**
   * Register a hook into this instance of Atlas with the given alias
   *
   * @param     {String}    alias           The alias for the hook - it will be used for passing
   *                                        configuration data to it
   * @param     {class}     Component       The hook class
   * @param     {Object}    opts            Runtime options for the hook
   * @param     {Object}    opts.aliases    Bindings to other defined components
   * @return    {this}
   */
  hook(alias, Component, opts = {}) {
    this::component({
      type: 'hook',
      alias,
      Component,
      aliases: opts.aliases,
    }, this.#catalog.hooks)

    return this
  }

  /**
   * Register an action into this instance of Atlas with the given alias
   *
   * @param     {String}    alias           The alias for the action - it will be used for exposing
   *                                        the action's API on the atlas.actions object and for
   *                                        passing configuration data to it
   * @param     {class}     Component       The action class
   * @param     {Object}    opts            Runtime options for the action
   * @param     {Object}    opts.aliases    Bindings to other defined components
   * @return    {this}
   */
  action(alias, Component, opts = {}) {
    this::component({
      type: 'action',
      alias,
      Component,
      aliases: opts.aliases,
    }, this.#catalog.actions)

    return this
  }

  /**
   * Prepare all services and hooks for use
   *
   * Generally you should use `atlas.start()` instead to get your instance up and running. However,
   * sometimes it is necessary to get all the services into a "get-ready" state before they start
   * connecting to remote resources or doing any intensive I/O operations.
   *
   * @return    {Promise<this>}
   */
  async prepare() {
    if (this.prepared) {
      return this
    }

    const catalog = this.#catalog
    const { services, actions, hooks } = catalog

    for (const [alias, container] of hooks) {
      if (!container.Component.observes) {
        throw new FrameworkError(`Hook ${alias} does not have static 'observes' property`)
      }

      // Prepare observers of Atlas itself
      if (container.Component.observes === 'atlas') {
        this.#observers.set(alias, container)
      }
    }

    // Prepare all components, in parallel 💪
    void (await Promise.all([
      ...Array.from(hooks).map(async ([, container]) => ({
        expose: false,
        value: await container.prepare({ catalog }),
      })),
      ...Array.from(services).map(async ([alias, container]) => ({
        expose: container.Component.internal ? false : 'services',
        value: await container.prepare({ catalog }),
        alias,
      })),
      ...Array.from(actions).map(async ([alias, container]) => ({
        expose: container.Component.internal ? false : 'actions',
        value: await container.prepare({ catalog }),
        alias,
      })),
    ]))
      .filter(result => Boolean(result.expose))
      .forEach(result => this::expose(result.expose, result.alias, result.value))

    this.#prepared = true
    await this.#observers::dispatch('afterPrepare', this)

    return this
  }

  /**
   * Start all services
   *
   * @return    {Promise<this>}
   */
  async start() {
    const { actions, services, hooks } = this.#catalog

    await this.prepare()
    await this.#observers::dispatch('beforeStart', this)

    await Promise.all([
      ...Array.from(hooks),
      ...Array.from(actions),
    ].map(([, container]) => container.start({ hooks })))

    // Start all services, in the order they were added to the instance 💪
    // Ordering is important here! Some services should be started as the last ones because they
    // expose some functionality to the outside world and starting those before ie. a database
    // service is started might break stuff!
    for (const [, container] of services) {
      try {
        await container.start({ hooks })
      } catch (err) {
        // Roll back
        await this.stop()
          // Shit just got serious 😱
          .catch(stopErr => void this.log.fatal({ err: stopErr }, 'atlas:start:rollback-failure'))

        // Re-throw the original error which caused Atlas to fail to start
        throw err
      }
    }

    this.#started = true
    await this.#observers::dispatch('afterStart', this)
    this.log.info('atlas:ready')

    return this
  }

  /**
   * Stop all services, unregister all actions and hooks and unpublish any APIs exposed by them
   *
   * This puts the whole application into a state as it was before `atlas.prepare()` and/or
   * `atlas.start()` was called.
   *
   * @return    {Promise<this>}
   */
  async stop() {
    const { services, actions, hooks } = this.#catalog

    await this.#observers::dispatch('beforeStop', this)

    await Promise.all([
      ...Array.from(hooks),
      ...Array.from(actions),
    ].map(([, container]) => container.stop()))

    let error

    // Stop all services, in the reverse order they were added to the instance 💪
    // This will make sure the most important services are stopped first.
    for (const [alias, container] of Array.from(services).reverse()) {
      try {
        delete this.services[alias]
        await container.stop({ hooks })
      } catch (err) {
        error = err
        // Leave this service as is and move to the next service. We probably cannot do anything to
        // properly stop this service. 🙁
        continue
      }
    }

    // Unregister actions
    for (const [alias] of actions) {
      delete this.actions[alias]
    }

    this.#started = false
    this.#prepared = false

    await hooks::dispatch('afterStop', null)
    this.log.info('atlas:stopped')

    // If there was an error thrown in one of the services during .stop(), re-throw it now
    if (error) {
      throw error
    }

    return this
  }
}

export default Atlas
