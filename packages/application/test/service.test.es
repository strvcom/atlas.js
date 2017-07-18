import Application from '..'
import { FrameworkError } from '@strv/errors'

class DummyService {
  prepare() {}
  start() {}
  stop() {}
}

describe('Application::service()', () => {
  let app
  let options

  beforeEach(() => {
    options = {
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
})
