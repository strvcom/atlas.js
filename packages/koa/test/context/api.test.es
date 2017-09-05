import { ContextHook } from '../..'
import { FrameworkError } from '@atlas.js/errors'
import testcontext from './testcontext'

describe('Koa: ContextHook', () => {
  let hook
  let server

  beforeEach(() => {
    server = { context: {} }
    hook = new ContextHook({
      app: {
        root: __dirname,
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

  it('implements `application:prepare:after`', () => {
    expect(hook).to.respondTo('application:prepare:after')
  })

  it('defines its defaults', () => {
    expect(ContextHook).to.have.property('defaults')
    expect(ContextHook.defaults).to.have.all.keys([
      'module',
    ])
  })


  describe('application:prepare:after', () => {
    it('adds all properties from the module to koa.context', async () => {
      const names = Object.keys(testcontext)

      // Sanity check
      expect(names.length).to.be.above(0)
      expect(server.context).to.not.have.all.keys(names)

      await hook['application:prepare:after']()

      expect(server.context).to.have.all.keys(names)
    })

    it('throws when the property already exists on koa.context', () => {
      server.context.testmethod = () => {}
      expect(() =>
        hook['application:prepare:after']()
      ).to.throw(FrameworkError, /Unable to extend koa.context/)
    })
  })
})
