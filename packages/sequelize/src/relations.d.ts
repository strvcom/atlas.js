import AtlasHook from '@atlas.js/hook'

/**
 * This hook allows you to describe your model's associations (relations) directly on the model
 */
declare class RelationsHook extends AtlasHook {
  afterPrepare(): void
}

export default RelationsHook
