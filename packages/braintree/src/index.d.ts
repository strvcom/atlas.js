import AtlasService from '@atlas.js/service'
import { ServiceApi } from '@atlas.js/service'

// @TODO: Braintree does not have typings. Watch for any changes to that situation. 👀
declare type Braintree = object

declare class Service extends AtlasService {
  /** Runtime configuration values */
  config: Service.Config

  prepare(): Promise<ServiceApi>
  start(service: ServiceApi): Promise<ServiceApi>
  stop(service: ServiceApi): Promise<void>
}

declare namespace Service {
  /** Configuration schema available to this service */
  type Config = {
    /**
     * Environment to connect to
     *
     * Available values:
     *
     * ```js
     * import { Braintree } from '@atlas.js/braintree'
     * Braintree.Environment.{choose one}
     * ```
     */
    environment: object
    merchantId: string
    publicKey: string
    privateKey: string
  }
}

export {
  Service,
  Braintree,
}
