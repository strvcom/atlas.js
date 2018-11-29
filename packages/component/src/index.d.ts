declare module '@atlas.js/component' {
  import * as Pino from 'pino'
  import { Atlas } from '@atlas.js/atlas'

  type ComponentName = string

  /**
   * A base class implementing common behaviour for Service, Action and Hook subclasses
   *
   * You should not use this class directly and instead use either `Service`, `Action` or `Hook`
   * subclasses.
   *
   * @abstract
   */
  export default abstract class Component {
    /**
     * By default, a component is marked as "public", ie. accessible on the Atlas instance. With
     * this set to `true` you will only be able to access this component only via inter-component
     * resolution mechanism (`this.component(name)`).
     *
     * This is useful to hide various low-level or "glue" components from the public API surface.
     */
    static internal: boolean

    /**
     * Default configuration for this component
     *
     * @deprecated    Use the `config` static property (JSON schema) to describe your configuration
     */
    static defaults: object

    /** JSON Schema describing this component's configuration values */
    static config: object

    /** Array of component aliases which this component consumes/requires */
    static requires: Array<ComponentName>

    /**
     * A child log created specifically for this component to easily distinguish log entries coming
     * from this component
     */
    log: Pino.Logger

    /** The Atlas instance which is currently managing this component */
    atlas: Atlas

    /** Runtime configuration values as received from the user, with defaults applied */
    config: object

    /**
     * Get the instance of a component
     *
     * @param     componentName   The name of the component to retrieve, as defined in this
     *                            component's `static requires` array.
     */
    component(componentName: ComponentName): any

    /**
     * Dispatch an event to all hooks listening on this component
     *
     * @param    event      The event to dispatch (an arbitrary string)
     * @param    subject    The thing to send to the hooks along with this event as an argument
     */
    dispatch(event: string, subject: any): Promise<void>
  }
}
