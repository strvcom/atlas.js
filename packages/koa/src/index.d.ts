import * as http from 'http'

import Server from './server'
import ContextHook from './context'
import WebsocketHook from './websocket'
import * as koa from 'koa'

declare class Koa extends koa {
  /**
   * The underlying HTTP server created for this Koa instance
   *
   * The server is only created during the `start` Atlas lifecycle and is destroyed during `stop`.
   */
  server: http.Server
}

export {
  Server,
  ContextHook,
  WebsocketHook,
  Koa,
}
