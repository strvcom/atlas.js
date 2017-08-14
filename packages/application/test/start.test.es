import Application from '..'
import Service from '@atlas.js/service'
import Hook from '@atlas.js/hook'

class DummyService extends Service {}

class DummyHook extends Hook {}

describe('Application::start()', () => {
  let app
  let options

  beforeEach(() => {
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
    app.prepare = sinon.stub().resolves()
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
    beforeEach(() => {
      DummyService.prototype.start = sinon.stub().resolves()
      app.service('dummy', DummyService)
    })


    it('calls start on the service', async () => {
      await app.start()
      expect(DummyService.prototype.start).to.have.callCount(1)
    })

    it('calls start with the instance returned from prepare() step', async () => {
      const instance = { test: true }
      app.services.dummy = instance
      await app.start()

      expect(DummyService.prototype.start).to.have.been.calledWith(instance)
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

    beforeEach(() => {
      DummyService.prototype.prepare = sinon.stub().resolves()

      // Stub out all the event handlers
      for (const event of events) {
        DummyHook.prototype[event] = sinon.stub().resolves()
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
