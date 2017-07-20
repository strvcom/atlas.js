import Application from '..'
import { FrameworkError } from '@theframework/errors'

class DummyAction {}

describe('Application::action()', () => {
  let app
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
    app = new Application(options)
  })

  it('returns this', () => {
    expect(app.action('dummy', DummyAction)).to.equal(app)
  })

  it('throws when the alias has already been used by another action', () => {
    app.action('dummy', DummyAction)
    expect(() => app.action('dummy', DummyAction)).to.throw(FrameworkError)
  })

  it('throws when the action is not a class/function', () => {
    expect(() => app.action('dummy', {})).to.throw(FrameworkError)
  })

  it('provides the app on action constructor argument', () => {
    const action = sinon.spy()
    app.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args).to.have.property('app')
    expect(args.app).to.equal(app)
  })

  it('provides a logger instance on action constructor argument', () => {
    const action = sinon.spy()
    app.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args).to.have.property('log')
    expect(args.log).to.be.an('object')
    expect(args.log.chindings).to.match(/"action":"dummy"/)
  })

  it('provides the config object on action constructor argument', () => {
    const action = sinon.spy()
    app.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args).to.have.property('config')
    expect(args.config).to.be.an('object')
    expect(args.config).to.equal(options.config.actions.dummy)
  })

  it('applies defaults defined on action on top of user-provided config', () => {
    const action = sinon.spy()
    action.defaults = { default: true }
    app.action('dummy', action)
    const args = action.getCall(0).args[0]

    expect(args.config).to.have.property('default', true)
  })
})
