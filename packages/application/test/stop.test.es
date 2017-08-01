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
    beforeEach(function() {
      DummyHook.prototype['application:stop:before'] = this.sb.each.stub().resolves()
      DummyHook.prototype['application:stop:after'] = this.sb.each.stub().resolves()
      DummyHook.prototype['service:stop:before'] = this.sb.each.stub().resolves()
      DummyHook.prototype['service:stop:after'] = this.sb.each.stub().resolves()
      DummyHook.prototype['dummy:stop:before'] = this.sb.each.stub().resolves()
      DummyHook.prototype['dummy:stop:after'] = this.sb.each.stub().resolves()
    })

    it('calls the stop hooks', async () => {
      await app.stop()

      const proto = DummyHook.prototype
      expect(proto['application:stop:before']).to.have.callCount(1)
      expect(proto['application:stop:after']).to.have.callCount(1)
      expect(proto['service:stop:before']).to.have.callCount(1)
      expect(proto['service:stop:after']).to.have.callCount(1)
      expect(proto['dummy:stop:before']).to.have.callCount(1)
      expect(proto['dummy:stop:after']).to.have.callCount(1)
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
