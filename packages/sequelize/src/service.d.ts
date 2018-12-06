import AtlasService from '@atlas.js/service'
import * as sequelize from 'sequelize'

/**
 * Use Sequelize ORM from within Atlas
 *
 * This service allows you to use Sequelize for connecting to various SQL databases
 */
declare class Service extends AtlasService {
  /** Service runtime configuration values */
  config: Service.Config

  prepare(): Promise<sequelize.Sequelize>
  start(service: sequelize.Sequelize): Promise<sequelize.Sequelize>
  stop(service: sequelize.Sequelize): Promise<void>
}

declare namespace Service {
  /** Configuration schema available to this service */
  interface Config {
    /**
     * URI to connect to
     * @default   sqlite://atlas-db.sqlite
     */
    uri?: string
    /**
     * Connection options
     */
    options?: sequelize.Options
  }
}

export default Service
