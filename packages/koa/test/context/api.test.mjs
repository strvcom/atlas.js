import path from 'path'
import { ContextHook } from '../..'
import { FrameworkError } from '@atlas.js/errors'
import testcontext from './testcontext'

describe('Koa: ContextHook', () => {
  let hook
  let server

  beforeEach(() => {
    server = { context: {} }
    hook = new ContextHook({
      atlas: {
        root: __dirname,
        // eslint-disable-next-line global-require
        require: location => require(path.resolve(__dirname, location)),
      },
      config: {
        module: 'testcontext',
      },
      resolve() { return server },
    })
  })


  it('exists', () => {
    expect(ContextHook).to.be.a('function')
  })

  it('implements `afterPrepare`', () => {
    expect(hook).to.respondTo('afterPrepare')
  })

  it('defines its defaults', () => {
    expect(ContextHook).to.have.property('defaults')
    expect(ContextHook.defaults).to.have.all.keys([
      'module',
    ])
  })


  describe('afterPrepare', () => {
    it('adds all properties from the module to koa.context', async () => {
      const names = Object.keys(testcontext)

      // Sanity check
      expect(names.length).to.be.above(0)
      expect(server.context).to.not.have.all.keys(names)

      await hook.afterPrepare()

      expect(server.context).to.have.all.keys(names)
    })

    it('throws when the property already exists on koa.context', () => {
      server.context.testmethod = () => {}
      expect(() => hook.afterPrepare())
        .to.throw(FrameworkError, /Unable to extend koa.context/)
    })
  })
})
