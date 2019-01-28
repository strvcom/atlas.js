import Component from '@atlas.js/component'

type ServiceApi = Object | Function | Array<Object | Function>

/**
 * Base service class which all Atlas services should subclass
 *
 * This class provides basic functionality to integrate a Service into Atlas. Atlas expects all
 * Services to have a certain interface, therefore when you want to create your own service, you
 * should subclass this base Service class.
 *
 * @abstract
 */
declare abstract class Service extends Component {
  /** @private */
  static type: 'service'

  /**
   * Prepare the service instance your consumers will use in their projects
   *
   * You must implement this method in a subclass.
   * You should not attempt to make any connections or other I/O unless absolutely necessary for
   * preparing the service for work. This method should only be used to expose the data structures
   * your consumers will have access to. Atlas uses this method to allow component inspection in a
   * REPL or to provide some auto-complete suggestions when using the CLI.
   *
   * @abstract
   * @return    {Promise<ServiceApi>}   The API your users will be interacting with. It can be
   *                                    anything, really, but usually it will be some kind of
   *                                    connection object or similar.
   */
  abstract prepare(): Promise<ServiceApi>

  /**
   * Start the service or put the service into a fully functional and ready state
   *
   * @abstract
   * @param    ServiceApi     The API your users will be interacting with. You should provide this
   *                          API as the return value of the `.prepare()` method.
   */
  abstract start(service: ServiceApi): Promise<ServiceApi>

  /**
   * Stop the service by terminating any pending connections and finishing all pending work
   *
   * @abstract
   * @param    ServiceApi     The API your users have interacted with. You created this API as the
   *                          return value of the `.prepare()` method.
   */
  abstract stop(service: ServiceApi): Promise<void>
}

export default Service
export {
  ServiceApi,
}
