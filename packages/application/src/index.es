// We use for-await pattern quite extensively here for legitimate purposes
/* eslint-disable no-await-in-loop */

import path from 'path'
import pino from 'pino'
import _ from 'lodash'
import hidden from 'local-scope/create'
import { FrameworkError } from '@theframework/errors'

/**
 * This class represents your application and aggregates all components together
 *
 * You should generally create only one instance of this class in a program.
 */
class Application {
  static defaults = {
    log: {
      name: path.basename(process.cwd()),
      level: 'info',
      serializers: pino.stdSerializers,
    },
  }

  /**
   * Initialise a brand-new app from the given module locations
   *
   * @param     {Object}      options                       Configuration options
   * @param     {String}      options.env                   The environment under which to operate
   * @param     {String}      options.root                  The root directory to which all other
   *                                                        directories mentioned here are relative
   * @param     {String}      options.config='config'       Module location for the configuration
   * @param     {String}      options.hooks='hooks'         Module location for the hooks
   * @param     {String}      options.services='services'   Module location for the services
   * @param     {String}      options.actions='actions'     Module location for the actions
   * @return    {Application}
   */
  static init(options = {}) {
    const { env, root } = options

    _.defaultsDeep(options, {
      config: 'config',
      hooks: 'hooks',
      services: 'services',
      actions: 'actions',
    })

    if (!root) {
      throw new FrameworkError(`root must be explicitly specified, got ${root}`)
    }

    // Got all we need, start loading the modules
    const modules = {
      /* eslint-disable global-require */
      config: require(path.resolve(root, options.config)),
      env: require(path.resolve(root, options.config, 'env', options.env)),
      hooks: require(path.resolve(root, options.hooks)),
      services: require(path.resolve(root, options.services)),
      actions: require(path.resolve(root, options.actions)),
      /* eslint-enable global-require */
    }
    const config = _.merge({}, modules.config, modules.env)
    const app = new this({ env, root, config })

    // Hooks
    for (const [alias, Hook] of Object.entries(modules.hooks)) {
      app.hook(alias, Hook)
    }

    // Services
    for (const [alias, Service] of Object.entries(modules.services)) {
      app.service(alias, Service)
    }

    // Actions
    for (const [alias, Action] of Object.entries(modules.actions)) {
      app.action(alias, Action)
    }

    return app
  }


  /**
   * The current environment under which this app operates
   *
   * Defaults to NODE_ENV from the environment.
   *
   * @readonly
   * @return    {String}
   */
  get env() {
    return this::hidden().env
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
    return this::hidden().root
  }

  /**
   * Is this app in a prepared state?
   *
   * @readonly
   * @return    {boolean}
   */
  get prepared() {
    return this::hidden().prepared
  }

  /**
   * Is this app in a started state?
   *
   * @readonly
   * @return    {boolean}
   */
  get started() {
    return this::hidden().started
  }

  /**
   * Application configuration, as passed in to the constructor
   *
   * @type    {Object}
   */
  config = {}

  /**
   * All services added to this application
   *
   * @type    {Object}
   */
  services = {}

  /**
   * All actions added to this application
   *
   * @type    {Object}
   */
  actions = {}

  /**
   * Create a new application
   *
   * @param     {Object}    options             Options for the app
   * @param     {Object}    options.config      Configuration object for the app and for all
   *                                            services or other components which will be added to
   *                                            the app
   * @param     {String}    options.root        The root directory of the application
   * @param     {String}    options.env         The environment under which this app operates.
   *                                            Components may use this value for various purposes.
   *                                            Defaults to NODE_ENV.
   */
  constructor(options = {}) {
    if (typeof options.root !== 'string') {
      throw new FrameworkError(`root must be explicitly specified, got ${options.root}`)
    }

    // Initialise private stuff
    // eslint-disable-next-line no-process-env
    this::hidden().env = options.env || process.env.NODE_ENV
    this::hidden().root = options.root
    this::hidden().prepared = false
    this::hidden().started = false
    this::hidden().catalog = {
      services: new Map(),
      hooks: new Map(),
      actions: new Map(),
    }

    if (!this::hidden().env) {
      throw new FrameworkError('env not specified and NODE_ENV was not set')
    }

    this.config = mkdefaults(options.config, {
      application: {},
      services: {},
      hooks: {},
      actions: {},
    })
    this.config.application = mkdefaults(this.config.application, Application.defaults)
    this.log = pino(this.config.application.log)
  }

  /**
   * Register a service into this app at given alias
   *
   * @param     {String}    alias     The alias for the service - it will be used for exposing the
   *                                  service's API on the app.services object and for passing
   *                                  configuration data to it
   * @param     {class}    Service    The service class
   * @return    {this}
   */
  service(alias, Service) {
    const { services } = this::hidden().catalog

    // Safety checks first
    if (services.has(alias)) {
      throw new FrameworkError(`Service with alias ${alias} already used`)
    }

    if (typeof Service !== 'function') {
      throw new FrameworkError(`Service must be a class, got ${typeof Service}`)
    }

    this.config.services[alias] = mkdefaults(this.config.services[alias], Service.defaults)
    services.set(alias, new Service({
      app: this,
      log: this.log.child({ service: alias }),
    }))

    this.log.debug({ service: alias }, 'service:add')

    return this
  }

  /**
   * Register a hook into this app using given alias
   *
   * @param     {String}    alias     The alias for the hook - it will be used for passing
   *                                  configuration data to it
   * @param     {class}    Hook       The hook class
   * @return    {this}
   */
  hook(alias, Hook) {
    const { hooks } = this::hidden().catalog

    // Safety checks first
    if (hooks.has(alias)) {
      throw new FrameworkError(`Hook with alias ${alias} already used`)
    }

    if (typeof Hook !== 'function') {
      throw new FrameworkError(`Hook must be a class, got ${typeof Hook}`)
    }

    this.config.hooks[alias] = mkdefaults(this.config.hooks[alias], Hook.defaults)
    hooks.set(alias, new Hook({
      app: this,
      log: this.log.child({ hook: alias }),
    }))

    this.log.debug({ hook: alias }, 'hook:add')

    return this
  }

  /**
   * Register an action into this app at given alias
   *
   * @param     {String}    alias     The alias for the action - it will be used for exposing the
   *                                  action's API on the app.actions object and for passing
   *                                  configuration data to it
   * @param     {class}    Action     The action class
   * @return    {this}
   */
  action(alias, Action) {
    const { actions } = this::hidden().catalog

    // Safety checks first
    if (actions.has(alias)) {
      throw new FrameworkError(`Action with alias ${alias} already used`)
    }

    if (typeof Action !== 'function') {
      throw new FrameworkError(`Action must be a class, got ${typeof Action}`)
    }

    this.config.actions[alias] = mkdefaults(this.config.actions[alias], Action.defaults)
    actions.set(alias, new Action({
      app: this,
      log: this.log.child({ action: alias }),
      config: this.config.actions[alias],
    }))

    this.log.debug({ action: alias }, 'action:add')

    return this
  }

  /**
   * Prepare all services and hooks for use
   *
   * Generally you should use `app.start()` instead to get your app up and running. However,
   * sometimes it is necessary to get all the services into a "get-ready" state before they start
   * connecting to remote resources or doing any intensive I/O operations.
   *
   * @return    {Promise<this>}
   */
  async prepare() {
    if (this.prepared) {
      return this
    }

    const { services, hooks, actions } = this::hidden().catalog

    // Prepare all hooks, in parallel 💪
    await Promise.all(Array.from(hooks).map(([alias, hook]) =>
    // eslint-disable-next-line no-use-before-define
      this::lifecycle.hook.prepare(alias, hook)
    ))

    // Prepare actions
    for (const [alias, action] of actions) {
      this.actions[alias] = action
    }

    // Prepare all services, in parallel 💪
    await Promise.all(Array.from(services).map(([alias, service]) =>
      // eslint-disable-next-line no-use-before-define
      this::lifecycle.service.prepare(alias, service)
    ))

    this::hidden().prepared = true

    return this
  }

  /**
   * Start all services
   *
   * @return    {Promise<this>}
   */
  async start() {
    if (this.started) {
      return this
    }

    await this.prepare()
    await this::dispatch('application:start:before')

    const { services } = this::hidden().catalog

    // Start all services, in parallel 💪
    await Promise.all(Array.from(services).map(([alias, service]) =>
      // eslint-disable-next-line no-use-before-define
      this::lifecycle.service.start(alias, service)
    ))

    this::hidden().started = true
    await this::dispatch('application:start:after')
    this.log.info('app:ready')

    return this
  }

  /**
   * Stop all services, unregister all actions and hooks and unpublish any APIs exposed by them
   *
   * This puts the whole application into a state as it was before `app.prepare()` and/or
   * `app.start()` was called.
   *
   * @return    {Promise<this>}
   */
  async stop() {
    if (!this.started) {
      return this
    }

    const { services, actions } = this::hidden().catalog

    await this::dispatch('application:stop:before')

    // Stop all services, in parallel 💪
    await Promise.all(Array.from(services).map(([alias, service]) =>
      // eslint-disable-next-line no-use-before-define
      this::lifecycle.service.stop(alias, service)
    ))

    // Unregister actions
    for (const [alias] of actions) {
      delete this.actions[alias]
    }

    this::hidden().started = false
    this::hidden().prepared = false

    await this::dispatch('application:stop:after')
    this.log.info('app:stopped')

    return this
  }
}

/**
 * Assign default values to a configuration object
 *
 * @private
 * @param     {Object}    [config={}]    Target object
 * @param     {Object}    [defaults={}]    Default values
 * @return    {Object}
 */
function mkdefaults(config = {}, defaults = {}) {
  return _.defaultsDeep(config, defaults)
}

/**
 * Expose a getter on the application instance under the specified collection (object)
 *
 * @private
 * @param     {String}    collection    The collection (object) onto which to attach the getter
 * @param     {String}    property      The getter's name/key
 * @param     {mixed}     value       The value to return from the getter
 * @return    {void}
 */
function expose(collection, property, value) {
  Object.defineProperty(this[collection], property, {
    enumerable: true,
    configurable: true,
    get: () => value,
  })
}

/**
 * Dispatch an event to all registered hooks
 *
 * This function takes variable number of events to be dispatched to hooks
 *
 * @private
 * @param     {String}    event     The event's name
 * @return    {Promise<void>}
 */
async function dispatch(...events) {
  const { hooks } = this::hidden().catalog
  const tasks = []

  for (const [alias, hook] of hooks) {
    for (const event of events) {
      if (typeof hook[event] === 'function') {
        this.log.debug({ hook: alias, event }, 'event:dispatch')
        tasks.push(hook[event]())
      }
    }
  }

  await Promise.all(tasks)
}

const lifecycle = {
  service: {
    /**
     * Prepare a service
     *
     * @private
     * @param     {String}    alias       The Service's alias
     * @param     {Object}    service     The service implementation
     * @return    {Promise<void>}
     */
    async prepare(alias, service) {
      this.log.debug({ service: alias }, 'service:prepare:before')
      await this::dispatch(
        'service:prepare:before',
        `${alias}:prepare:before`,
      )
      const config = this.config.services[alias]
      const instance = await service.prepare({ config })
      this::expose('services', alias, instance)
      this.log.debug({ service: alias }, 'service:prepare:after')
      await this::dispatch(
        'service:prepare:after',
        `${alias}:prepare:after`,
      )
    },

    /**
     * Start a service
     *
     * @private
     * @param     {String}    alias       The Service's alias
     * @param     {Object}    service     The service implementation
     * @return    {Promise<void>}
     */
    async start(alias, service) {
      this.log.debug({ service: alias }, 'service:start:before')
      await this::dispatch(
        'service:start:before',
        `${alias}:start:before`,
      )
      await service.start()
      this.log.debug({ service: alias }, 'service:start:after')
      await this::dispatch(
        'service:start:after',
        `${alias}:start:after`,
      )
    },

    /**
     * Stop a service
     *
     * @private
     * @param     {String}    alias       The Service's alias
     * @param     {Object}    service     The service implementation
     * @return    {Promise<void>}
     */
    async stop(alias, service) {
      this.log.debug({ service: alias }, 'service:stop:before')
      await this::dispatch(
        'service:stop:before',
        `${alias}:stop:before`,
      )
      delete this.services[alias]
      await service.stop()
      this.log.debug({ service: alias }, 'service:stop:after')
      await this::dispatch(
        'service:stop:after',
        `${alias}:stop:after`,
      )
    },
  },

  hook: {
    /**
     * Prepare a hook
     *
     * @private
     * @param     {String}    alias     The Service's alias
     * @param     {Object}    hook      The hook implementation
     * @return    {Promise<void>}
     */
    async prepare(alias, hook) {
      this.log.debug({ hook: alias }, 'hook:prepare:before')
      const config = this.config.hooks[alias]
      await hook.prepare({ config })
      this.log.debug({ hook: alias }, 'hook:prepare:after')
    },
  },
}

export default Application
