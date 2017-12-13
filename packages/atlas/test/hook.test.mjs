import { Atlas } from '..'
import Hook from '@atlas.js/hook'
import { FrameworkError } from '@atlas.js/errors'

class DummyHook extends Hook {}

describe('Atlas::hook()', () => {
  let atlas
  let options

  beforeEach(() => {
    options = {
      root: __dirname,
      config: {
        hooks: {
          dummy: {
            test: true,
          },
        },
      },
    }
    atlas = new Atlas(options)
  })

  it('returns this', () => {
    expect(atlas.hook('dummy', DummyHook)).to.equal(atlas)
  })

  it('throws when the alias has already been used by another hook', () => {
    atlas.hook('dummy', DummyHook)
    expect(() => atlas.hook('dummy', DummyHook)).to.throw(FrameworkError)
  })

  it('throws when the hook is not a class/function', () => {
    expect(() => atlas.hook('dummy', {})).to.throw(FrameworkError)
  })

  it('provides the atlas on hook constructor argument', () => {
    const hook = sinon.spy()
    atlas.hook('dummy', hook)
    const args = hook.getCall(0).args[0]

    expect(args).to.have.property('atlas')
    expect(args.atlas).to.equal(atlas)
  })

  it('provides a logger instance on hook constructor argument', () => {
    const hook = sinon.spy()
    atlas.hook('dummy', hook)
    const args = hook.getCall(0).args[0]

    expect(args).to.have.property('log')
    expect(args.log).to.be.an('object')
    expect(args.log.chindings).to.match(/"hook":"dummy"/)
  })

  it('provides config object on hook constructor argument', () => {
    const hook = sinon.spy()
    atlas.hook('dummy', hook)
    const args = hook.getCall(0).args[0]

    expect(args).to.have.property('config')
    expect(args.config).to.be.an('object')
    expect(args.config).to.equal(options.config.hooks.dummy)
  })

  it('provides the resolve function on hook constructor argument as `component`', () => {
    const hook = sinon.spy()
    atlas.hook('dummy', hook)
    const args = hook.getCall(0).args[0]

    expect(args).to.have.property('component')
    expect(args.component).to.be.a('function')
  })

  it('applies defaults defined on hook on top of user-provided config', () => {
    const hook = sinon.spy()
    hook.defaults = { default: true }
    atlas.hook('dummy', hook)
    const args = hook.getCall(0).args[0]

    expect(args.config).to.have.property('default', true)
  })

  it('throws when aliases do not satisfy requirements of the component', () => {
    const hook = sinon.spy()
    hook.requires = ['service:dummy', 'action:dummy']
    expect(() => {
      atlas.hook('dummy', hook)
    }).to.throw(FrameworkError, /Missing aliases for component dummy/)
  })

  it('throws when extraneous aliases are specified', () => {
    const hook = sinon.spy()
    expect(() => {
      atlas.hook('dummy', hook, { aliases: {
        'service:dummy': 'dummy',
      } })
    }).to.throw(FrameworkError, /Unneeded aliases for component dummy/)
  })

  it('works when all requirements are specified', () => {
    const hook = sinon.spy()
    hook.requires = ['service:dummy', 'action:dummy']
    expect(() => {
      atlas.hook('dummy', hook, { aliases: {
        'service:dummy': 'dummy',
        'action:dummy': 'dummy',
      } })
    }).to.not.throw()
  })
})
