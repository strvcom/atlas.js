import { Atlas } from '@atlas.js/atlas'
import AtlasService from '@atlas.js/service'
import * as objection from 'objection'
import * as knex from 'knex'

/**
 * Use Objection ORM from within Atlas
 *
 * This service allows you to use Objection for connecting to various SQL databases and also loads
 * Objection models from a specified module location.
 */
declare class Service extends AtlasService {
  /** Service runtime configuration values */
  config: Service.Config

  prepare(): Promise<Service.ServiceApi>
  start(service: Service.ServiceApi): Promise<Service.ServiceApi>
  stop(service: Service.ServiceApi): Promise<void>
}

declare namespace Service {
  /** The API that you will be interacting with when this service is exposed from Atlas */
  interface ServiceApi {
    connection: knex
    models: {
      [key: string]: Model
    }
  }

  class Model extends objection.Model {
    static atlas: Atlas
    atlas: Atlas
  }

  /** Configuration schema available to this service */
  interface Config {
    /** Configuration options for knex */
    knex: knex.Config
    /**
     * Module location from which to load Objection models
     * @default   models
     */
    models: string
    /**
     * Whether or not to pre-load (prefetch) table metadata to avoid fetching them during actual requests
     *
     * This should help in production deployments by eliminating one extra query when the table
     * metadata becomes necessary.
     * @default   true
     */
    prefetch: boolean
  }
}

export default Service
