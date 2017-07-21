import { MiddlewareHook } from '../..'
import * as testmiddleware from './testmiddleware'

describe('Koa: MiddlewareHook', () => {
  let hook
  let server

  beforeEach(() => {
    server = { use: sinon.spy() }
    hook = new MiddlewareHook({
      app: {
        root: __dirname,
        services: {
          server,
        },
      },
    })
    hook.prepare({
      config: {
        service: 'server',
        module: 'testmiddleware',
        middleware: {},
      },
    })
  })


  it('exists', () => {
    expect(MiddlewareHook).to.be.a('function')
  })

  it('implements prepare', () => {
    expect(hook).to.respondTo('prepare')
  })

  it('implements `application:start:before`', () => {
    expect(hook).to.respondTo('application:start:before')
  })

  it('defines its defaults', () => {
    expect(MiddlewareHook).to.have.property('defaults')
    expect(MiddlewareHook.defaults).to.have.all.keys([
      'service',
      'module',
      'middleware',
    ])
  })


  describe('application:start:before', () => {
    it('loads all exported middleware from the specified module into Koa', async () => {
      hook['application:start:before']()

      expect(testmiddleware.first).to.have.callCount(1)
      expect(testmiddleware.second).to.have.callCount(1)
      expect(server.use).to.have.callCount(2)
    })

    it('passes the provided middleware config to the middleware', () => {
      hook.prepare({
        config: {
          service: 'server',
          module: 'testmiddleware',
          middleware: {
            first: { firsttest: true },
            second: { secondtest: true },
          },
        },
      })
      hook['application:start:before']()

      const args = {
        first: testmiddleware.first.lastCall.args[0],
        second: testmiddleware.second.lastCall.args[0],
      }

      expect(args.first).to.eql({ firsttest: true })
      expect(args.second).to.eql({ secondtest: true })
    })
  })
})
