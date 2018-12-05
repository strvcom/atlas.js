import AtlasHook from '@atlas.js/hook'

/**
 * This hook allows you to load your Mongoose schemas from a particular module location and add them
 * to the Mongoose service as models.
 *
 * The models exported at the specified location will then be accessible via
 * `atlas.services.mongoose.model('name')`.
 */
declare class ModelsHook extends AtlasHook {
  config: ModelsHook.Config

  afterPrepare(): void
}

declare namespace ModelsHook {
  /** Configuration schema available to this hook */
  interface Config {
    /**
     * The module location, relative to `atlas.root`, from which to load the Mongoose models
     * @default   models
     */
    module: string
  }
}

export default ModelsHook
