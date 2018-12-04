import Server from './server'
import ContextHook from './context'
import WebsocketHook from './websocket'
import * as Koa from 'koa'

declare module '@atlas.js/koa' {
  export {
    Server,
    ContextHook,
    WebsocketHook,
    Koa,
  }
}
