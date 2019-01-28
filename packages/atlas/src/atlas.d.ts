import * as Ajv from 'ajv'
import * as Pino from 'pino'
import Component from '@atlas.js/component'

declare interface ComponentConstructor {
  new (): Component
}

/** Input options for `Atlas.init()` */
declare type InitOptions = Options & {
  /**
   * Path to a module from which service components should be loaded
   * @default   services
   */
  services?: string
  /**
   * Path to a module from which action components should be loaded
   * @default   actions
   */
  actions?: string
  /**
   * Path to a module from which hook components should be loaded
   * @default   hooks
   */
  hooks?: string
  /**
   * Path to the module where the aliases are defined
   * @default   aliases
   */
  aliases?: string
  /**
   * Path to a module from which component configuration should be loaded (or the configuration
   * object itself)
   * @default   config
   */
  config?: Options["config"]
}

/** Input options for `Atlas.bootstrap()` */
declare type BootstrapOptions = Options & {
  /**
   * All services to be added to Atlas. The key is the alias for the component and the value is
   * the Component class itself (ie. `new Component()` will be called on the value).
   */
  services: { [key: string]: ComponentConstructor }
  /**
   * All actions to be added to Atlas. The key is the alias for the component and the value is
   * the Component class itself (ie. `new Component()` will be called on the value).
   */
  actions: { [key: string]: ComponentConstructor }
  /**
   * All hooks to be added to Atlas. The key is the alias for the component and the value is
   * the Component class itself (ie. `new Component()` will be called on the value).
   */
  hooks: { [key: string]: ComponentConstructor }
}

/**
 * Input options for the second argument of `atlas.action()`, `atlas.service()`, `atlas.hook()`
 */
declare type ComponentOptions = {
  /**
   * If this component requires other components, you must specify their aliases you chose for
   * them here. The key is the component name which is used by this component, and the value
   * is the alias you chose for that compoennt in this instance of Atlas.
   */
  aliases: {
    [name: string]: string
  }
}

/** Input options for the second argument of `atlas.require()` */
declare type RequireOptions = {
  /** If true, do not throw if the module does not exist */
  optional: boolean,
  /** If true, prefer the ES modules' `default` export over named or CommonJS exports */
  normalise: boolean,
  /**
   * If true, will try to load the module without resolving the specified location to the project
   * root (it will load the module using standard Node's mechanism).
   */
  absolute: boolean
}

/** Input options for the `new Atlas()` constructor */
declare type Options = {
  /**
   * Environment to run Atlas in
   * @default   process.env.NODE_ENV
   */
  env?: string
  /** Absolute path to folder structure where Atlas can expect its components to be defined */
  root: string
  /**
   * Configuration options for Atlas and all components
   *
   * If string is provided, it will be used as path relative to `root` and required. The resulting
   * object will be used as the configuration object. If an object is provided, it will be used
   * as-is.
   *
   * @default   config
   */
  config?: Config | string
}

/**
 * Configuration object which Atlas accepts. Child values are either passed to Atlas directly or
 * to individual components. The objects are delivered to components by checking the configuration
 * keys against the component's associated alias.
 */
declare type Config = {
  /** Configuration options for Atlas itself */
  atlas?: Atlas.Config

  /**
   * Configuration options for services.
   *
   * The key must be the alias used when adding the service to Atlas, and the value will be
   * provided to the component as its configuration.
   */
  services: { [key: string]: any }
  /**
   * Configuration options for actions.
   *
   * The key must be the alias used when adding the action to Atlas, and the value will be
   * provided to the component as its configuration.
   */
  actions: { [key: string]: any }
  /**
   * Configuration options for hooks.
   *
   * The key must be the alias used when adding the hook to Atlas, and the value will be
   * provided to the component as its configuration.
   */
  hooks: { [key: string]: any }
}


/**
 * The main point of interaction with Atlas.
 */
declare class Atlas {
  /**
   * Default values for configuration options which Atlas accepts.
   */
  static readonly defaults: Atlas.Config

  /** Current execution environment (usually mirrors `process.env.NODE_ENV` unless overriden) */
  readonly env: string

  /**
   * The root folder where all other paths should be relative to
   *
   * It is recommended that you set this to the project's root directory.
  */
  readonly root: string

  /** Is this instance in a prepared state? */
  readonly prepared: boolean

  /** Is this instance in a started state? */
  readonly started: boolean

  // @TODO: Make this work so that the declarations can remain here and still be overridable
  // The following properties are not included in the type definitions so that users can
  // declare their own local, per-project overloads which add proper type hints to these properties.

  /** Configuration for Atlas and all associated components, as passed in to the constructor */
  // readonly config: Config

  /** All services added to this instance */
  // readonly services: object

  /** All actions added to this instance */
  // readonly actions: object

  /** An instance of Ajv used to validate component configuration */
  validator: Ajv.Ajv

  /** Logger used throughout Atlas and its components */
  log: Pino.Logger

  /**
   * Initialise Atlas instance from the module paths provided in the `options` object
   *
   * Use this method to quickly configure Atlas instance by simply telling it where your
   * components live on the filesystem, and Atlas will load them from the given module locations
   * and add them to the Atlas instance.
   *
   * This is the preferred way of initialising an Atlas instance.
   */
  static init(options: InitOptions): Atlas

  /**
   * Bootstrap the given Atlas instance with the provided modules
   *
   * Use this method to quickly set up the given Atlas instance to use the provided components.
   * This is useful if you need to have multiple entry points to your program and some entry
   * points should only use some components available. This is especially useful when implementing
   * worker processes where you only need a subset of all available components. This method, while
   * more verbose as Atlas.init(), still frees you from manually adding all the components by hand
   * while providing greater flexibility as to which components will be used.
   */
  static bootstrap(atlas: Atlas, options: BootstrapOptions): Atlas

  /**
   * Create a new Atlas instance
   *
   * Generally you should not need to create an Atlas instance via its constructor and use either
   * the `Atlas.init()` or `Atlas.bootstrap()` options which are more easy to use. Using the
   * constructor is more verbose but provides greatest level of control over the initialisation.
   *
   * You will have to manually register each component to the instance.
   */
  constructor(options: Options)

  /**
   * Require a module by path, relative to the project root
   *
   * @param   {string}          location  Location of the module to load, relative to `atlas.root`
   *                                      (unless `{ absolute: true }`)
   * @param   {RequireOptions}  options   Options which affect how the module will be loaded
   */
  require(location: string, options?: RequireOptions): any

  /**
   * Register a service into this instance of Atlas with the given alias
   *
   * @param   {string}                alias       Alias to associate with this component
   * @param   {ComponentConstructor}  Component   The component class. It will be constructed
   *                                              using `new Component()` during startup.
   * @param   {ComponentOptions}      options     Options for the component
   */
  service(alias: string, Component: ComponentConstructor, options: ComponentOptions): this

  /**
   * Register a hook into this instance of Atlas with the given alias
   *
   * @param   {string}                alias       Alias to associate with this component
   * @param   {ComponentConstructor}  Component   The component class. It will be constructed
   *                                              using `new Component()` during startup.
   * @param   {ComponentOptions}      options     Options for the component
   */
  hook(alias: string, Component: ComponentConstructor, options: ComponentOptions): this

  /**
   * Register an action into this instance of Atlas with the given alias
   *
   * @param   {string}                alias       Alias to associate with this component
   * @param   {ComponentConstructor}  Component   The component class. It will be constructed
   *                                              using `new Component()` during startup.
   * @param   {ComponentOptions}      options     Options for the component
   */
  action(alias: string, Component: ComponentConstructor, options: ComponentOptions): this

  /**
   * Prepare all services and hooks for use
   *
   * Generally you should use `atlas.start()` instead to get your instance up and running.
   * However, sometimes it is necessary to get all the services into a "get-ready" state before
   * they start connecting to remote resources or doing any intensive I/O operations.
   */
  prepare(): Promise<Atlas>

  /**
   * Start alll services
   *
   * This puts all components into a fully functional state, with all connections established (if
   * any) and ready for use once this function resolves.
   */
  start(): Promise<Atlas>

  /**
   * Stop all services, unregister all actions and hooks and unpublish any APIs exposed by them
   *
   * This puts the whole application into a state as it was before `atlas.prepare()` and/or
   * `atlas.start()` was called.
   */
  stop(): Promise<Atlas>
}

declare namespace Atlas {
  /** Configuration options for Atlas */
  export type Config = {
    /** Configuration options for Atlas' pino logger */
    log?: Pino.LoggerOptions
    /** Configuration options for Atlas' component configuration validator */
    validator?: Ajv.Options & {
      /** Keywords to enable from the `ajv-keywords` package */
      keywords?: Array<string>
    }
  }
}

export default Atlas
