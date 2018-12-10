import AtlasService from '@atlas.js/service'
import { Mongoose, ConnectionOptions } from 'mongoose'

/**
 * Connect to a MongoDB server using the mongoose ODM
 *
 * This service allows you to connect to a MongoDB server and use the mongoose object document
 * model that comes with it from within Atlas.
 */
declare class Service extends AtlasService {
  /** Service runtime configuration values, with defaults applied */
  config: Service.Config

  prepare(): Promise<Mongoose>
  start(service: Mongoose): Promise<Mongoose>
  stop(service: Mongoose): Promise<void>
}

declare namespace Service {
  /** Configuration schema available to this service */
  type Config = {
    /**
     * MongoDB URI to connect to
     * @default   mongodb://127.0.0.1:27017
     */
    uri: string
    /** Additional connection options */
    options: ConnectionOptions
  }
}

export default Service
