import Application from '..'
import Service from '@theframework/service'
import Hook from '@theframework/hook'

class DummyService extends Service {}

class DummyAction {}

class DummyHook extends Hook {}

describe('Application::stop()', () => {
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
        hooks: {
          dummy: {
            test: true,
          },
        },
      },
    }
    app = new Application(options)
    app.service('dummy', DummyService)
    app.action('dummy', DummyAction)
    app.hook('dummy', DummyHook)

    return app.start()
  })


  it('is async', () => {
    expect(app.stop()).to.be.instanceof(Promise)
  })

  it('returns this', async () => {
    expect(await app.stop()).to.equal(app)
  })

  it('sets app.started and app.prepared to false', async () => {
    expect(app.started).to.equal(true)
    expect(app.prepared).to.equal(true)
    await app.stop()
    expect(app.started).to.equal(false)
    expect(app.prepared).to.equal(false)
  })


  describe('Service interactions', () => {
    beforeEach(function() {
      this.sb.each.stub(DummyService.prototype, 'stop').resolves()
    })


    it('calls stop on the service', async () => {
      await app.stop()
      expect(DummyService.prototype.stop).to.have.callCount(1)
    })

    it('calls the method only once for each service for multiple .stop() calls', async () => {
      await app.stop()
      await app.stop()

      expect(DummyService.prototype.stop).to.have.callCount(1)
    })

    it('removes getters for services', async () => {
      expect(app.services).to.have.property('dummy')
      await app.stop()
      expect(app.services).to.not.have.property('dummy')
    })
  })


  describe('Service interactions - dispatching events', () => {
    const events = [
      'application:stop:before',
      'application:stop:after',
      'service:stop:before',
      'dummy:stop:before',
    ]

    beforeEach(function() {
      this.sb.each.stub(DummyService.prototype, 'prepare').resolves()

      // Stub out all the event handlers
      for (const event of events) {
        DummyHook.prototype[event] = this.sb.each.stub().resolves()
      }
    })

    it('calls the stop hooks', async () => {
      await app.stop()

      for (const event of events) {
        expect(DummyHook.prototype[event]).to.have.callCount(1)
      }
    })

    it('calls the hook with the service instance before stop', async () => {
      const proto = DummyHook.prototype
      const instance = { api: true }
      // Redefine the service getter so we can properly test the hooks
      Object.defineProperty(app.services, 'dummy', {
        value: instance,
      })

      await app.stop()

      expect(proto['service:stop:before']).to.have.been.calledWith(instance)
      expect(proto['dummy:stop:before']).to.have.been.calledWith(instance)
    })
  })


  describe('Action interactions', () => {
    it('removes the action from this.actions', async () => {
      // Sanity check
      expect(app.actions).to.have.property('dummy')

      await app.stop()
      expect(app.actions).to.not.have.property('dummy')
    })
  })
})
