import { Atlas } from '..'
import Action from '@atlas.js/action'
import {
  FrameworkError,
  ValidationError,
} from '@atlas.js/errors'

class DummyAction extends Action {}

describe('Atlas::action()', () => {
  let atlas
  let options

  beforeEach(() => {
    options = {
      root: __dirname,
      config: {
        actions: {
          dummy: {
            test: true,
          },
        },
      },
    }
    atlas = new Atlas(options)
  })

  it('returns this', () => {
    expect(atlas.action('dummy', DummyAction)).to.equal(atlas)
  })

  it('throws when the alias has already been used by another action', () => {
    atlas.action('dummy', DummyAction)
    expect(() => atlas.action('dummy', DummyAction)).to.throw(FrameworkError)
  })

  it('throws when the action is not a class/function', () => {
    expect(() => atlas.action('dummy', {})).to.throw(FrameworkError)
  })

  it('provides the atlas on action constructor argument', () => {
    const action = sinon.spy()
    action.config = {}
    atlas.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args).to.have.property('atlas')
    expect(args.atlas).to.equal(atlas)
  })

  it('provides a logger instance on action constructor argument', () => {
    const action = sinon.spy()
    action.config = {}
    atlas.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args).to.have.property('log')
    expect(args.log).to.be.an('object')
    expect(args.log.chindings).to.match(/"action":"dummy"/u)
  })

  it('provides the config object on action constructor argument', () => {
    const action = sinon.spy()
    action.config = {}
    atlas.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args).to.have.property('config')
    expect(args.config).to.be.an('object')
    expect(args.config).to.equal(options.config.actions.dummy)
  })

  it('provides the resolve function on action constructor argument as `component`', () => {
    const action = sinon.spy()
    action.config = {}
    atlas.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args).to.have.property('component')
    expect(args.component).to.be.a('function')
  })

  it('applies defaults defined on action on top of user-provided config', () => {
    const action = sinon.spy()
    action.config = {}
    action.defaults = { default: true }
    atlas.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args.config).to.have.property('default', true)
  })

  it('throws when aliases do not satisfy requirements of the component', () => {
    const action = sinon.spy()
    action.config = {}
    action.requires = ['service:dummy']
    expect(() => {
      atlas.action('dummy', action)
    }).to.throw(FrameworkError, /Missing aliases for component dummy/u)
  })

  it('throws when extraneous aliases are specified', () => {
    const action = sinon.spy()
    action.config = {}
    expect(() => {
      atlas.action('dummy', action, { aliases: {
        'service:dummy': 'dummy',
      } })
    }).to.throw(FrameworkError, /Unneeded aliases for component dummy/u)
  })

  it('throws when user config fails component config schema', function() {
    options.config.actions.dummy = { lol: true }
    atlas = new Atlas(options)
    this.sandbox.stub(atlas.log, 'error')

    const action = sinon.spy()
    action.config = {
      type: 'object',
      additionalProperties: false,
      properties: {
        test: { type: 'boolean' },
      },
    }

    expect(() => atlas.action('dummy', action)).to.throw(ValidationError)

    try {
      atlas.action('dummy', action)
    } catch (err) {
      expect(err.context).to.have.all.keys([
        'type',
        'alias',
        'schema',
        'config',
      ])
      expect(err.context.schema).to.equal(action.config)
      expect(err.context.config).to.equal(options.config.actions.dummy)
      expect(err.context.alias).to.equal('dummy')
    }
  })

  it('works when user config passes component config schema', () => {
    const action = sinon.spy()
    action.config = {
      type: 'object',
      additionalProperties: false,
      properties: {
        test: { type: 'boolean' },
      },
    }

    expect(() => atlas.action('dummy', action)).not.to.throw(ValidationError)
  })

  it('works when all requirements are specified', () => {
    const action = sinon.spy()
    action.config = {}
    action.requires = ['service:dummy']
    expect(() => {
      atlas.action('dummy', action, { aliases: {
        'service:dummy': 'dummy',
      } })
    }).to.not.throw()
  })
})
