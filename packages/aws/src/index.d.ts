import * as AWS from 'aws-sdk'
import { GlobalConfigInstance } from 'aws-sdk/lib/config'
import * as AWSClients from 'aws-sdk/clients/all'
import AtlasService from '@atlas.js/service'

declare type AWSServiceApi = {
  [key: string]: object
}

/**
 * Load and set up AWS services for use from within Atlas
 *
 * This class loads the AWS clients for which it will find a configuration object (even if it is
 * empty). This is done to reduce memory footprint (the AWS SDK it huge!), so only specified
 * clients will be loaded.
 */
declare class Service extends AtlasService {
  /** Runtime configuration values */
  config: Service.Config

  /**
   * Prepare an AWS client instance
   *
   * ⚠️ Note that the client will only include services for which a key in the configuration has
   * been defined.
   */
  prepare(): Promise<AWSServiceApi>
  start(service: AWSServiceApi): Promise<AWSServiceApi>
  stop(service: AWSServiceApi): Promise<void>
}

declare namespace Service {
  /** Configuration schema available to this service */
  type Config = {
    /** Global configuration options which will be applied into every service */
    globals: GlobalConfigInstance

    /**
     * Configuration options which will be applied only to specific services
     *
     * ⚠️ Note that only services for which a configuration object has been defined will be made
     * available, so make sure you declare at least an empty object here if you want to use that
     * service.
     */
    services?: {
      [key: string]: GlobalConfigInstance
    }
  }
}

export {
  Service,
  AWS,
}
