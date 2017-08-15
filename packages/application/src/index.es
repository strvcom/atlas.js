// We use for-await pattern quite extensively here for legitimate purposes
/* eslint-disable no-await-in-loop */

import path from 'path'
import pino from 'pino'
import {
  defaultsDeep as defaults,
  merge,
} from 'lodash'
import hidden from 'local-scope/create'
import { FrameworkError } from '@atlas.js/errors'
import { ComponentContainer } from './private'

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
   * @param     {String}      options.aliases='aliases'     Module location for the aliases
   * @return    {Application}
   */
  static init(options = {}) {
    const { env, root } = options

    defaults(options, {
      config: 'config',
      hooks: 'hooks',
      services: 'services',
      actions: 'actions',
      aliases: 'aliases',
    })

    if (!root) {
      throw new FrameworkError(`root must be explicitly specified, got ${root}`)
    }

    // Got all we need, start loading the modules
    const modules = {
      /* eslint-disable global-require */
      hooks: require(path.resolve(root, options.hooks)),
      services: require(path.resolve(root, options.services)),
      actions: require(path.resolve(root, options.actions)),
      aliases: require(path.resolve(root, options.aliases)),
      /* eslint-enable global-require */
    }

    defaults(modules.aliases, {
      actions: {},
      hooks: {},
      services: {},
    })

    // Loading the config is supported at the constructor level, no need to do anything special here
    const app = new this({ env, root, config: options.config })

    // Hooks
    for (const [alias, Hook] of Object.entries(modules.hooks)) {
      const aliases = modules.aliases.hooks[alias]
      app.hook(alias, Hook, { aliases })
    }

    // Services
    for (const [alias, Service] of Object.entries(modules.services)) {
      const aliases = modules.aliases.services[alias]
      app.service(alias, Service, { aliases })
    }

    // Actions
    for (const [alias, Action] of Object.entries(modules.actions)) {
      const aliases = modules.aliases.actions[alias]
      app.action(alias, Action, { aliases })
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

    // Safety checks
    if (!this::hidden().env) {
      throw new FrameworkError('env not specified and NODE_ENV was not set')
    }

    if (typeof this::hidden().root !== 'string') {
      throw new FrameworkError(`root must be explicitly specified, got ${options.root}`)
    }

    this.config = this::mkconfig(options.config, {
      application: {},
      services: {},
      hooks: {},
      actions: {},
    })
    this.config.application = defaults(this.config.application, Application.defaults)
    // Logger 🌲
    this.log = pino(this.config.application.log)
  }

  /**
   * Register a service into this app at given alias
   *
   * @param     {String}    alias           The alias for the service - it will be used for exposing
   *                                        the service's API on the app.services object and for
   *                                        passing configuration data to it
   * @param     {class}     Component       The service class
   * @param     {Object}    opts            Runtime options for the service
   * @param     {Object}    opts.aliases    Bindings to other defined components
   * @return    {this}
   */
  service(alias, Component, opts = {}) {
    return this::component({
      type: 'service',
      alias,
      Component,
      aliases: opts.aliases,
    }, this::hidden().catalog.services)
  }

  /**
   * Register a hook into this app using given alias
   *
   * @param     {String}    alias           The alias for the hook - it will be used for passing
   *                                        configuration data to it
   * @param     {class}     Component       The hook class
   * @param     {Object}    opts            Runtime options for the hook
   * @param     {Object}    opts.aliases    Bindings to other defined components
   * @return    {this}
   */
  hook(alias, Component, opts = {}) {
    return this::component({
      type: 'hook',
      alias,
      Component,
      aliases: opts.aliases,
    }, this::hidden().catalog.hooks)
  }

  /**
   * Register an action into this app at given alias
   *
   * @param     {String}    alias           The alias for the action - it will be used for exposing
   *                                        the action's API on the app.actions object and for
   *                                        passing configuration data to it
   * @param     {class}     Component       The action class
   * @param     {Object}    opts            Runtime options for the action
   * @param     {Object}    opts.aliases    Bindings to other defined components
   * @return    {this}
   */
  action(alias, Component, opts = {}) {
    return this::component({
      type: 'action',
      alias,
      Component,
      aliases: opts.aliases,
    }, this::hidden().catalog.actions)
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

    const { services, actions } = this::hidden().catalog

    // Prepare actions
    for (const [alias, action] of actions) {
      this.actions[alias] = action.component
    }

    // Prepare all services, in parallel 💪
    await Promise.all(Array.from(services).map(([alias, service]) =>
      // eslint-disable-next-line no-use-before-define
      this::lifecycle.service.prepare(alias, service.component)
    ))

    this::hidden().prepared = true
    this::dispatch('application:prepare:after', this)

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
    await this::dispatch('application:start:before', this)

    const { services } = this::hidden().catalog

    // Start all services, in the order they were added to the app 💪
    // Ordering is important here! Some services should be started as the last ones because they
    // expose some functionality to the outside world and starting those before ie. a database
    // service is started might break stuff!
    for (const [alias, service] of services) {
      // eslint-disable-next-line no-use-before-define
      await this::lifecycle.service.start(alias, service.component)
    }

    this::hidden().started = true
    await this::dispatch('application:start:after', this)
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

    await this::dispatch('application:stop:before', this)

    // Stop all services, in the reverse order they were added to the app 💪
    // This will make sure the most important services are stopped first.
    for (const [alias, service] of Array.from(services).reverse()) {
      // eslint-disable-next-line no-use-before-define
      await this::lifecycle.service.stop(alias, service.component)
    }

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
 * Register a component into the given catalog
 *
 * @private
 * @param     {Object}    info              Component information
 * @param     {String}    info.type         The component's type (service, hook, action)
 * @param     {String}    info.alias        The component's user-specified name/alias
 * @param     {Class}     info.Component    The component class
 * @param     {Object}    info.aliases      Binding information to other defined components
 * @param     {Map}       catalog           The catalog to which to save the component
 * @return    {this}
 */
function component(info, catalog) {
  // Safety checks first
  if (catalog.has(info.alias)) {
    throw new FrameworkError(`Component with alias ${info.alias} (${info.type}) already used`)
  }

  // Pull user-provided config for this component
  // Use a plural form of the component type, ie., action -> actions, service -> services etc.
  info.config = this.config[`${info.type}s`][info.alias]

  catalog.set(info.alias, new ComponentContainer(info, this))
  this.log.debug({ [info.type]: info.alias }, `${info.type}:add`)

  return this
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
 * @param     {String|Array}    events    The events' names
 * @param     {mixed}           subject   The thing that is related to the event (ie. a component)
 *                                        It is given to the event handler on input.
 * @return    {Promise<void>}
 */
async function dispatch(events, subject) {
  events = Array.isArray(events)
    ? events
    : [events]

  const { hooks } = this::hidden().catalog
  const tasks = []

  for (const [alias, hook] of hooks) {
    for (const event of events) {
      // Is this hook listening for the event being dispatched?
      if (typeof hook.component[event] === 'function') {
        this.log.debug({ hook: alias, event }, 'event:dispatch')
        tasks.push(hook.component[event](subject))
      }
    }
  }

  await Promise.all(tasks)
}

/**
 * Create the configuration object from inputs
 *
 * For path-based configs, we additionally want to support:
 * - loading and applying environment overrides on top of the base config
 * - loading and applying local (per-machine) overrides on top of the config
 *
 * This pattern is frequent-enough that it warrants explicit support in core.
 *
 * @private
 * @param     {Object}    config        Base config object, or a string (path) to a module where
 *                                      the config should be loded from, relative to root
 * @param     {Object}    base          Default values to be added to the config object if they are
 *                                      missing from the input config
 * @return    {Object}
 */
function mkconfig(config = {}, base = {}) {
  if (typeof config === 'string') {
    const modules = {
      // eslint-disable-next-line global-require
      config: require(path.resolve(this.root, config)),
      env: optrequire(path.resolve(this.root, config, 'env', this.env)),
      local: optrequire(path.resolve(this.root, config, 'local')),
    }

    modules.config = merge(modules.config, modules.env, modules.local)
    modules.config = defaults(modules.config, base)

    return modules.config
  }

  // It's just an object, apply defaults and GTFO
  return defaults(config, base)
}

/**
 * Optionally require a module, returning null if the module cannot be required
 *
 * @private
 * @param     {String}    module    Path to the module to require
 * @return    {mixed}               The module's contents
 */
function optrequire(module) {
  try {
    // eslint-disable-next-line global-require
    return require(module)
  } catch (err) {
    return null
  }
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
      const instance = await service.prepare()
      this::expose('services', alias, instance)
      this.log.debug({ service: alias }, 'service:prepare:after')
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
      await service.start(this.services[alias])
      this.log.debug({ service: alias }, 'service:start:after')
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
      const instance = this.services[alias]
      delete this.services[alias]
      await service.stop(instance)
      this.log.debug({ service: alias }, 'service:stop:after')
    },
  },
}

export default Application
