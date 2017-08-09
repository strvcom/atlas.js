import path from 'path'
import Hook from '@atlas.js/hook'
import hidden from 'local-scope/create'

class MiddlewareHook extends Hook {
  static defaults = {
    module: 'middleware',
    middleware: {},
  }
  static requires = [
    'service:koa',
  ]


  prepare(options) {
    super.prepare(options)

    // Load the middleware module from the user-specified directory, relative to root
    // eslint-disable-next-line global-require
    this::hidden().middleware = require(path.resolve(this.app.root, this.config.module))
  }

  'application:start:before'() {
    // Register all loaded middleware into the Koa instance
    const config = this.config
    const middleware = this::hidden().middleware
    const koa = this.component('service:koa')

    for (const [name, handler] of Object.entries(middleware)) {
      const options = config.middleware[name]
      koa.use(handler(options))
    }
  }
}

export default MiddlewareHook
