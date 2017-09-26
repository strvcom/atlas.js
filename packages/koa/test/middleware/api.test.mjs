import path from 'path'
import { MiddlewareHook } from '../..'
import * as testmiddleware from './testmiddleware'

describe('Koa: MiddlewareHook', () => {
  let app
  let hook
  let server

  beforeEach(() => {
    app = {
      root: __dirname,
      // eslint-disable-next-line global-require
      require: location => require(path.resolve(__dirname, location)),
    }
    server = { use: sinon.spy() }
    hook = new MiddlewareHook({
      app,
      config: {
        module: 'testmiddleware',
        middleware: {},
      },
      resolve() { return server },
    })

    return hook['application:prepare:after']()
  })


  it('exists', () => {
    expect(MiddlewareHook).to.be.a('function')
  })

  it('implements `application:prepare:after`', () => {
    expect(hook).to.respondTo('application:prepare:after')
  })

  it('implements `application:start:before`', () => {
    expect(hook).to.respondTo('application:start:before')
  })

  it('defines its defaults', () => {
    expect(MiddlewareHook).to.have.property('defaults')
    expect(MiddlewareHook.defaults).to.have.all.keys([
      'module',
      'middleware',
    ])
  })


  describe('application:start:before', () => {
    it('loads all exported middleware from the specified module into Koa', async () => {
      await hook['application:start:before']()

      expect(testmiddleware.first).to.have.callCount(1)
      expect(testmiddleware.second).to.have.callCount(1)
      expect(server.use).to.have.callCount(2)
    })

    it('passes the provided middleware config to the middleware', async () => {
      hook = new MiddlewareHook({
        app,
        config: {
          module: 'testmiddleware',
          middleware: {
            first: { firsttest: true },
            second: { secondtest: true },
          },
        },
        resolve() { return server },
      })

      await hook['application:prepare:after']()
      await hook['application:start:before']()

      const args = {
        first: testmiddleware.first.lastCall.args[0],
        second: testmiddleware.second.lastCall.args[0],
      }

      expect(args.first).to.eql({ firsttest: true })
      expect(args.second).to.eql({ secondtest: true })
    })
  })
})
