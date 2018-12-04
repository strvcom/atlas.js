declare module '@atlas.js/braintree' {
  import AtlasService from '@atlas.js/service'
  import { ServiceApi } from '@atlas.js/service'

  // @TODO: Braintree does not have typings. Watch for any changes to that situation. 👀
  type Braintree = object

  interface Config {
    /**
     * Environment to connect to
     *
     * Available values:
     *
     * ```js
     * import { Braintree } from '@atlas.js/braintree'
     *
     * Braintree.Environment.{choose one}
     * ```
     */
    environment: object

    merchantId: string
    publicKey: string
    privateKey: string
  }

  class Service extends AtlasService {
    config: Config

    prepare(): Promise<ServiceApi>
    start(service: ServiceApi): Promise<ServiceApi>
    stop(service: ServiceApi): Promise<void>
  }

  export {
    Service,
    Config,
    Braintree,
  }
}
