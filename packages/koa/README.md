[koa-settings]: http://koajs.com/#settings
[http-settings]: https://nodejs.org/api/http.html#http_class_http_server


# @atlas.js/koa

Koa.js service and a Middleware hook loader for @atlas.js.

## Installation

`npm i @atlas.js/koa`

## Usage

### Service

The service configuration allows you to define three things:

- `listen`: A bind configuration, ie. to which host and port to bind
- `koa`: Koa configuration, ie. all the [properties you can set on the Koa instance][koa-settings]
- `server`: http configuration, ie. all the [properties you can set on the http server instance][http-settings]

```js
import { Application } from '@atlas.js/core'
import * as Koa from '@atlas.js/koa'

const app = new Application({
  config: {
    services: {
      http: {
        // Listen on this port and network interface
        listen: {
          port: 3000,
          hostname: '127.0.0.1',
        },
        // These are set on the http.Server instance
        server: {
          timeout: 30000,
        },
        // These are set on the Koa instance
        koa: {
          proxy: true,
        },
      }
    }
  }
})
app.service('http', Koa.Service)
await app.start()

// The Koa instance is now available here:
app.services.http
// And the http.Server instance is also exposed:
app.services.http.server
```

### MiddlewareHook

To add middleware to the Koa instance, it is recommended that this hook is used for that. It allows you to specify from which module the middleware should be loaded and adds it to Koa for you when the application starts.

#### Dependencies

- `service:koa`: A koa service to load the middleware into

```js
import { Application } from '@atlas.js/core'
import * as Koa from '@atlas.js/koa'

const app = new Application({
  config: {
    hooks: {
      middleware: {
        // The path to the module, relative to root, which should be loaded and
        // the exported middleware added to the Koa service
        module: 'middleware',
        middleware: {
          // You can define configuration options for your middleware here.
          // The key must match the exported middleware name.
        }
      }
    }
  }
})

app.service('http', Koa.Service)
app.hook('middleware', Koa.MiddlewareHook, {
  aliases: {
    'service:koa': 'http'
  }
})
await app.start()
```

#### Example middleware module

Here is an example middleware module that the `MiddlewareHook` expects to find.

```js
// middleware.js
import forcehttps from './forcehttps'
import routes from './routes'
import notfound from './notfound'

export {
  forcehttps,
  routes,
  notfound,
}
```

#### Accessing the Application instance

> The Application instance can be accessed through `ctx.atlas` in middleware or routes.

Here is an example middleware that makes use of the @atlas.js Application class inside the route handler. It returns 400 status code with a custom message when the request is made on an insecure protocol.

```js
// middleware/forcehttps.js
export default function mkforcehttps(config) {
  return function forcehttps(ctx, next) {
    // Here you can access the Application instance via `ctx.atlas`
    if (ctx.atlas.env === 'production' && !ctx.secure) {
      ctx.response.status = 426
      ctx.response.set({
        Upgrade: 'TLS/1.2, HTTP/1.1',
        Connection: 'Upgrade',
      })
      ctx.response.body = {
        message: 'I refuse to talk to you while anyone may be listening.',
      }

      return
    }

    await next()
  }
}

```

## License

See the [LICENSE](LICENSE) file for information.
