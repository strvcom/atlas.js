import Application from '..'
import Service from '@theframework/service'
import Hook from '@theframework/hook'
import Action from '@theframework/action'

class DummyService extends Service {
  static defaults = { default: true }
}

class DummyHook extends Hook {
  static defaults = { default: true }
}

class DummyAction extends Action {
  dummyMethod() {}
}

describe('Application::prepare()', () => {
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
        hooks: {
          dummy: {
            test: true,
          },
        },
      },
    }
    app = new Application(options)
  })


  it('is async', () => {
    expect(app.prepare()).to.be.instanceof(Promise)
  })

  it('returns this', async () => {
    expect(await app.prepare()).to.equal(app)
  })

  it('sets app.prepared to true', async () => {
    expect(app.prepared).to.equal(false)
    await app.prepare()
    expect(app.prepared).to.equal(true)
  })


  describe('Service interactions', () => {
    beforeEach(function() {
      this.sb.each.stub(DummyService.prototype, 'prepare').resolves()
      app.service('dummy', DummyService)
    })


    it('calls prepare on the service', async () => {
      await app.prepare()
      expect(DummyService.prototype.prepare).to.have.callCount(1)
    })

    it('exposes the returned instance on app.services', async () => {
      const instance = { api: true }
      DummyService.prototype.prepare.resolves(instance)
      await app.prepare()

      expect(app.services).to.have.property('dummy')
      expect(app.services.dummy).to.equal(instance)
    })

    it('calls the method only once for each service for multiple .prepare() calls', async () => {
      await app.prepare()
      await app.prepare()

      expect(DummyService.prototype.prepare).to.have.callCount(1)
    })

    it('receives an object with service configuration provided by user', async () => {
      await app.prepare()

      const opts = DummyService.prototype.prepare.getCall(0).args[0]
      expect(opts).to.have.key('config')
      expect(opts.config).to.be.an('object')
      expect(opts.config).to.equal(options.config.services.dummy)
    })

    it('applies defaults defined on service on top of user-provided config', async () => {
      await app.prepare()

      const opts = DummyService.prototype.prepare.getCall(0).args[0]
      expect(opts.config).to.have.property('default', true)
    })
  })


  describe('Action interactions', () => {
    it('exposes all actions on this.actions', async () => {
      app.action('dummy', DummyAction)
      await app.prepare()

      expect(app.actions).to.have.property('dummy')
      expect(app.actions.dummy).to.respondTo('dummyMethod')
    })
  })


  describe('Hook interactions', () => {
    beforeEach(function() {
      this.sb.each.stub(DummyHook.prototype, 'prepare').resolves()
      app.hook('dummy', DummyHook)
    })


    it('calls prepare on the hook', async () => {
      await app.prepare()
      expect(DummyHook.prototype.prepare).to.have.callCount(1)
    })

    it('calls the method only once for each hook for multiple .prepare() calls', async () => {
      await app.prepare()
      await app.prepare()

      expect(DummyHook.prototype.prepare).to.have.callCount(1)
    })

    it('receives an object with hook configuration provided by user', async () => {
      await app.prepare()

      const opts = DummyHook.prototype.prepare.getCall(0).args[0]
      expect(opts).to.have.key('config')
      expect(opts.config).to.be.an('object')
      expect(opts.config).to.equal(options.config.hooks.dummy)
    })

    it('applies defaults defined on hook on top of user-provided config', async () => {
      await app.prepare()

      const opts = DummyHook.prototype.prepare.getCall(0).args[0]
      expect(opts.config).to.have.property('default', true)
    })
  })

  describe('Hook interactions - dispatching events', () => {
    beforeEach(function() {
      DummyHook.prototype['service:prepare:before'] = this.sb.each.stub().resolves()
      DummyHook.prototype['service:prepare:after'] = this.sb.each.stub().resolves()
      DummyHook.prototype['dummy:prepare:before'] = this.sb.each.stub().resolves()
      DummyHook.prototype['dummy:prepare:after'] = this.sb.each.stub().resolves()
      app.service('dummy', DummyService)
      app.hook('dummy', DummyHook)
    })

    it('calls the prepare hooks', async () => {
      await app.prepare()

      const proto = DummyHook.prototype
      expect(proto['service:prepare:before']).to.have.callCount(1)
      expect(proto['service:prepare:after']).to.have.callCount(1)
      expect(proto['dummy:prepare:before']).to.have.callCount(1)
      expect(proto['dummy:prepare:after']).to.have.callCount(1)
    })

    it('can handle hooks which do not implement any listeners', async () => {
      class Empty {
        prepare() {}
      }

      app.hook('empty', Empty)
      // This not throwing will suffice 😎
      await app.prepare()
    })
  })
})
