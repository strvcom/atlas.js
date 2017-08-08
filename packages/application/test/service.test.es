import Application from '..'
import { FrameworkError } from '@theframework/errors'
import Service from '@theframework/service'

class DummyService extends Service {}

describe('Application::service()', () => {
  let app
  let options

  beforeEach(() => {
    options = {
      root: __dirname,
      config: {
        services: {
          dummy: {
            test: true,
          },
        },
      },
    }
    app = new Application(options)
  })

  it('returns this', () => {
    expect(app.service('dummy', DummyService)).to.equal(app)
  })

  it('throws when the alias has already been used by another service', () => {
    app.service('dummy', DummyService)
    expect(() => app.service('dummy', DummyService)).to.throw(FrameworkError)
  })

  it('throws when the service is not a class/function', () => {
    expect(() => app.service('dummy', {})).to.throw(FrameworkError)
  })

  it('provides the app on service constructor argument', () => {
    const service = sinon.spy()
    app.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args).to.have.property('app')
    expect(args.app).to.equal(app)
  })

  it('provides a logger instance on service constructor argument', () => {
    const service = sinon.spy()
    app.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args).to.have.property('log')
    expect(args.log).to.be.an('object')
    expect(args.log.chindings).to.match(/"service":"dummy"/)
  })

  it('provides config object on service constructor argument', () => {
    const service = sinon.spy()
    app.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args).to.have.property('config')
    expect(args.config).to.be.an('object')
    expect(args.config).to.equal(options.config.services.dummy)
  })

  it('provides the resolve function on service constructor argument', () => {
    const service = sinon.spy()
    app.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args).to.have.property('resolve')
    expect(args.resolve).to.be.a('function')
  })

  it('applies defaults defined on service on top of user-provided config', () => {
    const service = sinon.spy()
    service.defaults = { default: true }
    app.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args.config).to.have.property('default', true)
  })

  it('throws when aliases do not satisfy requirements of the component', () => {
    const service = sinon.spy()
    service.requires = ['service:dummy', 'action:dummy']
    expect(() => {
      app.service('dummy', service)
    }).to.throw(FrameworkError, /Unsatisfied component requirements/)
  })

  it('throws when extraneous aliases are specified', () => {
    const service = sinon.spy()
    expect(() => {
      app.service('dummy', service, { aliases: {
        'action:dummy': 'dummy',
      } })
    }).to.throw(FrameworkError, /Extraneous aliases provided/)
  })

  it('works when all requirements are specified', () => {
    const service = sinon.spy()
    service.requires = ['service:dummy', 'action:dummy']
    expect(() => {
      app.service('dummy', service, { aliases: {
        'service:dummy': 'dummy',
        'action:dummy': 'dummy',
      } })
    }).to.not.throw()
  })
})
