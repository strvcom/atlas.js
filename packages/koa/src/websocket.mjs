import Hook from '@atlas.js/hook'
import * as websocket from 'koa-websocket'
import middleware from './middleware'

class WebsocketHook extends Hook {
  static observes = 'service:koa'
  static requires = [
    'service:koa',
  ]

  static config = {
    type: 'object',
    default: {},
    additionalProperties: false,
    properties: {
      middleware: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
          module: {
            type: 'string',
            default: 'websocket/middleware',
          },
          config: {
            type: 'object',
            default: {},
          },
        },
      },

      listen: {
        type: 'object',
        properties: {
          host: { type: 'string' },
          port: { type: 'number' },
          backlog: { type: 'number' },
          path: { type: 'string' },
          noServer: {
            type: 'boolean',
            default: false,
          },
        },
      },
    },
  }

  afterPrepare() {
    /** @type {import("koa")} */
    const koa = this.component('service:koa')
    const config = this.config

    websocket(koa)
    this.log.debug('websocket:attach')

    // Apply websocket middleware
    if (config.middleware) {
      middleware(
        koa.ws,
        this.atlas.require(config.middleware.module, { normalise: true }),
        config.middleware.config,
      )
    }
  }

  afterStart() {
    /** @type {import("koa")} */
    const koa = this.component('service:koa')

    koa.ws.listen({
      ...this.config.listen,
      server: koa.server,
    })

    this.log.info({ addrinfo: koa.server.address() }, 'listening')
  }

  async beforeStop() {
    /** @type {import("koa")} */
    const koa = this.component('service:koa')

    this.log.info('websocket:close')

    await new Promise((resolve, reject) =>
      koa.ws.server.close(err =>
        err ? reject(err) : resolve()))
  }
}

export default WebsocketHook
