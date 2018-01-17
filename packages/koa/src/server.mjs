import http from 'http'
import Service from '@atlas.js/service'
import { FrameworkError } from '@atlas.js/errors'
import Koa from 'koa'
import middleware from './middleware'

class KoaService extends Service {
  static defaults = {
    middleware: {
      module: 'middleware',
      config: {},
    },

    listen: {
      // It is a general best practice in the Node.js ecosystem to use the PORT env var to specify
      // the port to which the web server should bind to -> let's respect that
      // eslint-disable-next-line no-process-env
      port: process.env.PORT || 3000,
      hostname: '127.0.0.1',
    },

    server: {
      // Overriden in this implementation to have lower value
      // These days most of the people deploy to Heroku and they have a request timeout of 30s
      timeout: 30000,
      // Defaults for Node.js
      maxHeadersCount: 2000,
      keepAliveTimeout: 5000,
    },

    koa: {
      proxy: false,
    },
  }


  prepare(options) {
    super.prepare(options)

    // Prepare Koa instance
    const koa = new Koa()
    koa.env = this.atlas.env
    koa.context.atlas = this.atlas
    koa.context.log = this.log

    // Apply Koa settings
    Object.assign(koa, this.config.koa)

    // Apply middleware
    if (this.config.middleware) {
      middleware(
        koa,
        this.atlas.require(this.config.middleware.module),
        this.config.middleware.config,
      )
    }

    return koa
  }

  async start(koa) {
    const server = http.createServer(koa.callback())
    koa.server = server

    // Apply server configuration
    Object.assign(server, this.config.server)

    // Ugh, events to Promise mapping is so ugly... 🤦
    await new Promise((resolve, reject) => {
      function ok() {
        server.removeListener('error', fail)
        return void resolve()
      }
      function fail(err) {
        server.removeListener('listening', ok)
        return void reject(err)
      }
      server.once('listening', ok)
      server.once('error', fail)

      // Listen already!
      koa.server.listen(this.config.listen.port, this.config.listen.hostname)
    })

    this.log.info({ addrinfo: server.address() }, 'listening')
  }

  async stop(koa) {
    if (!koa || !koa.server) {
      throw new FrameworkError('Cannot stop a non-running server')
    }

    const server = koa.server
    const addrinfo = server.address()

    await new Promise((resolve, reject) => {
      server.close(err => {
        err ? reject(err) : resolve()
      })
    })

    this.log.info({ addrinfo }, 'closed')
  }
}

export default KoaService
