declare module '@atlas.js/aws' {
  import * as AWS from 'aws-sdk'
  import { GlobalConfigInstance } from 'aws-sdk/lib/config'
  import * as AWSClients from 'aws-sdk/clients/all'
  import AtlasService from '@atlas.js/service'
  import { ServiceApi } from '@atlas.js/service'

  type ServiceName = string
  type ServiceConfig = object
  type AWSServiceApi = {
    [key: string]: object
  }

  interface Config {
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

  class Service extends AtlasService {
    config: GlobalConfigInstance

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

  export {
    Service,
    Config,
    AWS,
  }
}
