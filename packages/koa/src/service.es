import http from 'http'
import Service from '@theframework/service'
import { FrameworkError } from '@theframework/errors'
import Koa from 'koa'

class KoaService extends Service {
  static defaults = {
    server: {
      port: 3000,
      hostname: '127.0.0.1',
    },

    http: {
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
    this.instance = new Koa()
    this.instance.env = this.app.env
    this.instance.context.framework = this.app
    this.instance.context.log = this.log

    // Apply Koa settings
    Object.assign(this.instance, this.config.koa)

    return this.instance
  }

  async start() {
    const config = this.config
    const server = http.createServer(this.instance.callback())
    this.instance.server = server

    // Apply server configuration
    Object.assign(server, config.http)

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
      this.instance.server.listen(config.server.port, config.server.hostname)
    })

    this.log.info({ addrinfo: server.address() }, 'listening')
  }

  async stop() {
    if (!this.instance || !this.instance.server) {
      throw new FrameworkError('Cannot stop a non-running server')
    }

    const server = this.instance.server
    const addrinfo = server.address()
    this.instance = null

    await new Promise((resolve, reject) => {
      server.close(err => {
        err ? reject(err) : resolve()
      })
    })

    this.log.info({ addrinfo }, 'closed')
  }
}

export default KoaService
