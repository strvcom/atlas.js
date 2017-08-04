import Application from '..'
import Service from '@theframework/service'
import Hook from '@theframework/hook'

class DummyService extends Service {}

class DummyHook extends Hook {}

describe('Application::start()', () => {
  let app
  let options

  beforeEach(function() {
    options = {
      root: __dirname,
      config: {
        application: {
          log: {
            level: 'warn',
          },
        },
        services: {
          dummy: {
            test: true,
          },
        },
      },
    }
    app = new Application(options)
    this.sb.each.stub(app, 'prepare').resolves()
  })


  it('is async', () => {
    expect(app.start()).to.be.instanceof(Promise)
  })

  it('returns this', async () => {
    expect(await app.start()).to.equal(app)
  })

  it('sets app.started to true', async () => {
    expect(app.started).to.equal(false)
    await app.start()
    expect(app.started).to.equal(true)
  })

  it('calls app.prepare()', async () => {
    await app.start()
    expect(app.prepare).to.have.callCount(1)
  })


  describe('Service interactions', () => {
    beforeEach(function() {
      this.sb.each.stub(DummyService.prototype, 'start').resolves()
      app.service('dummy', DummyService)
    })


    it('calls start on the service', async () => {
      await app.start()
      expect(DummyService.prototype.start).to.have.callCount(1)
    })

    it('calls the method only once for each service for multiple .start() calls', async () => {
      await app.start()
      await app.start()

      expect(DummyService.prototype.start).to.have.callCount(1)
    })
  })


  describe('Hook interactions - dispatching events', () => {
    const events = [
      'application:start:before',
      'application:start:after',
    ]

    beforeEach(function() {
      this.sb.each.stub(DummyService.prototype, 'prepare').resolves()

      // Stub out all the event handlers
      for (const event of events) {
        DummyHook.prototype[event] = this.sb.each.stub().resolves()
      }

      app.service('dummy', DummyService)
      app.hook('dummy', DummyHook)
    })

    it('calls the start hooks', async () => {
      await app.start()

      for (const event of events) {
        expect(DummyHook.prototype[event]).to.have.callCount(1)
      }
    })

    it('calls the hooks with the application instance', async () => {
      const proto = DummyHook.prototype
      await app.start()

      for (const event of events) {
        expect(proto[event]).to.have.been.calledWith(app)
      }
    })

    it('can handle hooks which do not implement any listeners', async () => {
      class Empty {}

      app.hook('empty', Empty)
      // This not throwing will suffice 😎
      await app.start()
    })
  })
})
