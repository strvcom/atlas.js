import AtlasHook from '@atlas.js/hook'
import * as ws from 'ws'


type MiddlewareConfig = object

/**
 * Attach a websocket interface to a regular Koa server
 *
 * This allows you to upgrade your regular Koa server with websocker capabilities.
 */
declare class WebsocketHook extends AtlasHook {
  config: WebsocketHook.Config

  afterPrepare(): void
  afterStart(): void
  beforeStop(): Promise<void>
}

declare namespace WebsocketHook {
  /** Configuration schema available to this hook */
  type Config = {
    /** Configuration for the websocket's middleware loader */
    middleware: {
      /**
       * The middleware loader will load the middleware for the websocket interface at this module
       * location, relative to `atlas.root`.
       * @default   websocket/middleware
       */
      module: string
      /**
       * Configuration options for the individual middleware. The key should match the name of the
       * middleware under which it was exported from the module you specified in the `module`
       * configuration. The value will be passed directly to the middleware function.
       */
      config: {
        [key: string]: MiddlewareConfig
      }
    }

    /** Configuration options for the `ws.listen()` method */
    listen: ws.ServerOptions
  }
}

export default WebsocketHook
