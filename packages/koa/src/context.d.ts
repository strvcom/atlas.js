import AtlasHook from '@atlas.js/hook'

/**
 * This hook allows you to extend the default `Koa.Context` object with custom properties
 *
 * You specify a module from which to load an object and that object's enumerable properties will
 * be copied over onto `Koa.Context`. This means that all those properties will be available from
 * within route handlers on the `ctx` function argument.
 */
declare class ContextHook extends AtlasHook {
  config: ContextHook.Config

  afterPrepare(): void
}

declare namespace ContextHook {
  /** Configuration schema available to this hook */
  type Config = {
    /**
     * Location of the module, relative to `atlas.root`, from which to load the properties to extend
     * the base Koa.Context with
     * @default   koa-context
     */
    module: string
  }
}

export default ContextHook
