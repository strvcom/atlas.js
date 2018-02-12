import { Atlas } from '..'
import Service from '@atlas.js/service'
import Hook from '@atlas.js/hook'

class DummyService extends Service {}

class DummyAction {}

class DummyHook extends Hook {}

describe('Atlas::stop()', () => {
  let atlas
  let options

  beforeEach(() => {
    DummyService.prototype.prepare = sinon.stub().resolves()
    DummyService.prototype.stop = sinon.stub().resolves()

    options = {
      root: __dirname,
      config: {
        atlas: {
          log: {
            level: 'fatal',
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
    atlas = new Atlas(options)
    atlas.service('dummy', DummyService)
    atlas.action('dummy', DummyAction)
    atlas.hook('dummy', DummyHook)

    return atlas.start()
  })


  it('is async', () => {
    expect(atlas.stop()).to.be.instanceof(Promise)
  })

  it('returns this', async () => {
    expect(await atlas.stop()).to.equal(atlas)
  })

  it('sets atlas.started and atlas.prepared to false', async () => {
    expect(atlas.started).to.equal(true)
    expect(atlas.prepared).to.equal(true)
    await atlas.stop()
    expect(atlas.started).to.equal(false)
    expect(atlas.prepared).to.equal(false)
  })


  describe('Service interactions', () => {
    it('calls stop on the service', async () => {
      await atlas.stop()
      expect(DummyService.prototype.stop).to.have.callCount(1)
    })

    it('passes the exposed instance to the stop() method on the service', async () => {
      const instance = { test: true }
      DummyService.prototype.prepare.resolves(instance)

      atlas = new Atlas(options)
      atlas.service('dummy', DummyService)

      await atlas.start()
      await atlas.stop()

      expect(DummyService.prototype.stop).to.have.been.calledWith(instance)
    })

    it('calls the method only once for each service for multiple .stop() calls', async () => {
      await atlas.stop()
      await atlas.stop()

      expect(DummyService.prototype.stop).to.have.callCount(1)
    })

    it('removes getters for services', async () => {
      expect(atlas.services).to.have.property('dummy')
      await atlas.stop()
      expect(atlas.services).to.not.have.property('dummy')
    })

    it('re-throws component errors thrown during .stop()', () => {
      DummyService.prototype.stop.rejects(new Error('fail!'))

      return expect(atlas.stop()).to.eventually.be.rejectedWith(/fail!/)
    })

    it('stops the other services if one of the services throws during .stop()', async () => {
      class FailingService extends Service {}
      sinon.stub(FailingService.prototype, 'stop').rejects(new Error('fail!'))
      atlas.service('failing-service', FailingService)

      await atlas.start()
      await atlas.stop()
        .catch(() => {})

      expect(FailingService.prototype.stop).to.have.callCount(1)
      expect(DummyService.prototype.stop).to.have.callCount(1)
    })
  })


  describe('Service interactions - dispatching events', () => {
    const events = [
      'beforeStop',
      'afterStop',
    ]

    beforeEach(() => {
      // Stub out all the event handlers
      for (const event of events) {
        DummyHook.prototype[event] = sinon.stub().resolves()
      }
    })

    it('calls the stop hooks', async () => {
      await atlas.stop()

      for (const event of events) {
        expect(DummyHook.prototype[event]).to.have.callCount(1)
      }
    })

    it('calls the beforeStop hook with the application instance', async () => {
      const proto = DummyHook.prototype
      await atlas.stop()

      expect(proto.beforeStop).to.have.been.calledWith(atlas)
    })

    it('calls the afterStop hook with null', async () => {
      const proto = DummyHook.prototype
      await atlas.stop()
      const args = proto.afterStop.lastCall.args

      expect(args).to.have.length(1)
      expect(args[0]).to.equal(null)
    })
  })


  describe('Action interactions', () => {
    it('removes the action from this.actions', async () => {
      // Sanity check
      expect(atlas.actions).to.have.property('dummy')

      await atlas.stop()
      expect(atlas.actions).to.not.have.property('dummy')
    })
  })
})
