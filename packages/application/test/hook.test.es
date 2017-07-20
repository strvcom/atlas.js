import Application from '..'
import { FrameworkError } from '@theframework/errors'

class DummyHook {
  prepare() {}
  start() {}
  stop() {}
}

describe('Application::hook()', () => {
  let app
  let options

  beforeEach(() => {
    options = {
      config: {
        hooks: {
          dummy: {
            test: true,
          },
        },
      },
    }
    app = new Application(options)
  })

  it('returns this', () => {
    expect(app.hook('dummy', DummyHook)).to.equal(app)
  })

  it('throws when the alias has already been used by another hook', () => {
    app.hook('dummy', DummyHook)
    expect(() => app.hook('dummy', DummyHook)).to.throw(FrameworkError)
  })

  it('throws when the hook is not a class/function', () => {
    expect(() => app.hook('dummy', {})).to.throw(FrameworkError)
  })

  it('provides the app on hook constructor argument', () => {
    const hook = sinon.spy()
    app.hook('dummy', hook)
    const args = hook.getCall(0).args[0]

    expect(args).to.have.property('app')
    expect(args.app).to.equal(app)
  })

  it('provides a logger instance on hook constructor argument', () => {
    const hook = sinon.spy()
    app.hook('dummy', hook)
    const args = hook.getCall(0).args[0]

    expect(args).to.have.property('log')
    expect(args.log).to.be.an('object')
    expect(args.log.chindings).to.match(/"hook":"dummy"/)
  })
})
