import path from 'path'
import { MiddlewareHook } from '../..'
import * as testmiddleware from './testmiddleware'

describe('Koa: MiddlewareHook', () => {
  let atlas
  let hook
  let server

  beforeEach(() => {
    atlas = {
      root: __dirname,
      // eslint-disable-next-line global-require
      require: location => require(path.resolve(__dirname, location)),
    }
    server = { use: sinon.spy() }
    hook = new MiddlewareHook({
      atlas,
      config: {
        module: 'testmiddleware',
        middleware: {},
      },
      resolve() { return server },
    })

    return hook.afterPrepare()
  })


  it('exists', () => {
    expect(MiddlewareHook).to.be.a('function')
  })

  it('implements `afterPrepare`', () => {
    expect(hook).to.respondTo('afterPrepare')
  })

  it('implements `beforeStart`', () => {
    expect(hook).to.respondTo('beforeStart')
  })

  it('defines its defaults', () => {
    expect(MiddlewareHook).to.have.property('defaults')
    expect(MiddlewareHook.defaults).to.have.all.keys([
      'module',
      'middleware',
    ])
  })


  describe('beforeStart', () => {
    it('loads all exported middleware from the specified module into Koa', async () => {
      await hook.beforeStart()

      expect(testmiddleware.first).to.have.callCount(1)
      expect(testmiddleware.second).to.have.callCount(1)
      expect(server.use).to.have.callCount(2)
    })

    it('passes the provided middleware config to the middleware', async () => {
      hook = new MiddlewareHook({
        atlas,
        config: {
          module: 'testmiddleware',
          middleware: {
            first: { firsttest: true },
            second: { secondtest: true },
          },
        },
        resolve() { return server },
      })

      await hook.afterPrepare()
      await hook.beforeStart()

      const args = {
        first: testmiddleware.first.lastCall.args[0],
        second: testmiddleware.second.lastCall.args[0],
      }

      expect(args.first).to.eql({ firsttest: true })
      expect(args.second).to.eql({ secondtest: true })
    })

    it('passes the component instance to the middleware as second argument', async () => {
      await hook.beforeStart()

      const args = {
        first: testmiddleware.first.lastCall.args[1],
        second: testmiddleware.second.lastCall.args[1],
      }

      expect(args.first).to.equal(hook)
      expect(args.second).to.equal(hook)
    })
  })
})
