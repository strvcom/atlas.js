import Application from '..'

class DummyService {
  prepare() {}
  start() {}
  stop() {}
}

class DummyHook {
  prepare() {}
  'service:start:before'() {}
  'service:start:after'() {}
  'dummy:start:before'() {}
  'dummy:start:after'() {}
  'application:start:before'() {}
  'application:start:after'() {}
}

describe('Application::start()', () => {
  let app
  let options

  beforeEach(function() {
    options = {
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
    beforeEach(function() {
      this.sb.each.stub(DummyHook.prototype, 'application:start:before').resolves()
      this.sb.each.stub(DummyHook.prototype, 'service:start:before').resolves()
      this.sb.each.stub(DummyHook.prototype, 'dummy:start:before').resolves()
      this.sb.each.stub(DummyHook.prototype, 'application:start:after').resolves()
      this.sb.each.stub(DummyHook.prototype, 'service:start:after').resolves()
      this.sb.each.stub(DummyHook.prototype, 'dummy:start:after').resolves()
      app.service('dummy', DummyService)
      app.hook('dummy', DummyHook)
    })

    it('calls the start hooks', async () => {
      await app.start()

      const proto = DummyHook.prototype
      expect(proto['application:start:before']).to.have.callCount(1)
      expect(proto['application:start:after']).to.have.callCount(1)
      expect(proto['service:start:before']).to.have.callCount(1)
      expect(proto['service:start:after']).to.have.callCount(1)
      expect(proto['dummy:start:before']).to.have.callCount(1)
      expect(proto['dummy:start:after']).to.have.callCount(1)
    })

    it('can handle hooks which do not implement any listeners', async () => {
      class Empty {
        prepare() {}
      }

      app.hook('empty', Empty)
      // This not throwing will suffice 😎
      await app.start()
    })
  })
})
