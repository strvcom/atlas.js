import AtlasHook from '@atlas.js/hook'
import * as sequelize from 'sequelize'

/**
 * This hook allows you to import your Sequelize models from a particular module location into the
 * sequelize service
 */
declare class ModelsHook extends AtlasHook {
  /** Hook runtime configuration values */
  config: ModelsHook.Config

  afterPrepare(): void
}

declare namespace ModelsHook {
  /** Configuration schema available to this hook */
  interface Config {
    /**
     * Module location from which to load Sequelize models
     * @default   models
     */
    module: string
  }
}

export default ModelsHook
