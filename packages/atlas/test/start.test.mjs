import { Atlas } from '..'
import Service from '@atlas.js/service'
import Hook from '@atlas.js/hook'

class DummyService extends Service {}

class DummyHook extends Hook {}

describe('Atlas::start()', () => {
  let atlas
  let options

  beforeEach(() => {
    DummyService.prototype.prepare = sinon.stub().resolves()
    DummyService.prototype.start = sinon.stub().resolves()
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
      },
    }
    atlas = new Atlas(options)
    atlas.prepare = sinon.stub().resolves()
  })


  it('is async', () => {
    expect(atlas.start()).to.be.instanceof(Promise)
  })

  it('returns this', async () => {
    expect(await atlas.start()).to.equal(atlas)
  })

  it('sets atlas.started to true', async () => {
    expect(atlas.started).to.equal(false)
    await atlas.start()
    expect(atlas.started).to.equal(true)
  })

  it('calls atlas.prepare()', async () => {
    await atlas.start()
    expect(atlas.prepare).to.have.callCount(1)
  })


  describe('Service interactions', () => {
    beforeEach(() => {
      atlas.service('dummy', DummyService)
    })


    it('calls start on the service', async () => {
      await atlas.start()
      expect(DummyService.prototype.start).to.have.callCount(1)
    })

    it('calls start with the instance returned from prepare() step', async () => {
      const instance = { test: true }
      atlas.services.dummy = instance
      await atlas.start()

      expect(DummyService.prototype.start).to.have.been.calledWith(instance)
    })

    it('calls the method only once for each service for multiple .start() calls', async () => {
      await atlas.start()
      await atlas.start()

      expect(DummyService.prototype.start).to.have.callCount(1)
    })

    it('re-throws component errors thrown during .start()', () => {
      DummyService.prototype.start.rejects(new Error('fail!'))

      return expect(atlas.start()).to.eventually.be.rejectedWith(/fail!/)
    })

    it('stops already started service if one of the components fails to start', async () => {
      class FailingService extends Service {}
      sinon.stub(FailingService.prototype, 'start').rejects(new Error('fail!'))
      atlas.service('failing-service', FailingService)

      await atlas.start()
        .catch(() => {})

      expect(DummyService.prototype.start).to.have.callCount(1)
      expect(DummyService.prototype.stop).to.have.callCount(1)
    })
  })


  describe('Hook interactions - dispatching events', () => {
    const events = [
      'beforeStart',
      'afterStart',
    ]

    beforeEach(() => {
      // Stub out all the event handlers
      for (const event of events) {
        DummyHook.prototype[event] = sinon.stub().resolves()
      }

      atlas.service('dummy', DummyService)
      atlas.hook('dummy', DummyHook)
    })

    it('calls the start hooks', async () => {
      await atlas.start()

      for (const event of events) {
        expect(DummyHook.prototype[event]).to.have.callCount(1)
      }
    })

    it('calls the hooks with the atlas instance', async () => {
      const proto = DummyHook.prototype
      await atlas.start()

      for (const event of events) {
        expect(proto[event]).to.have.been.calledWith(atlas)
      }
    })

    it('can handle hooks which do not implement any listeners', async () => {
      class Empty {}

      atlas.hook('empty', Empty)
      // This not throwing will suffice 😎
      await atlas.start()
    })
  })
})
