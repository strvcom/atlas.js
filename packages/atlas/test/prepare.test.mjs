import { Atlas } from '..'
import Service from '@atlas.js/service'
import Hook from '@atlas.js/hook'
import Action from '@atlas.js/action'

class DummyService extends Service {
  static defaults = { default: true }
}

class DummyHook extends Hook {
  static defaults = { default: true }
}

class DummyAction extends Action {
  dummyMethod() {}
}

describe('Atlas::prepare()', () => {
  let atlas
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
    atlas = new Atlas(options)
  })


  it('is async', () => {
    expect(atlas.prepare()).to.be.instanceof(Promise)
  })

  it('returns this', async () => {
    expect(await atlas.prepare()).to.equal(atlas)
  })

  it('sets atlas.prepared to true', async () => {
    expect(atlas.prepared).to.equal(false)
    await atlas.prepare()
    expect(atlas.prepared).to.equal(true)
  })


  describe('Service interactions', () => {
    beforeEach(() => {
      DummyService.prototype.prepare = sinon.stub().resolves()
      atlas.service('dummy', DummyService)
    })


    it('calls prepare on the service', async () => {
      await atlas.prepare()
      expect(DummyService.prototype.prepare).to.have.callCount(1)
    })

    it('exposes the returned instance on atlas.services', async () => {
      const instance = { api: true }
      DummyService.prototype.prepare.resolves(instance)
      await atlas.prepare()

      expect(atlas.services).to.have.property('dummy')
      expect(atlas.services.dummy).to.equal(instance)
    })

    it('calls the method only once for each service for multiple .prepare() calls', async () => {
      await atlas.prepare()
      await atlas.prepare()

      expect(DummyService.prototype.prepare).to.have.callCount(1)
    })
  })


  describe('Action interactions', () => {
    it('exposes all actions on this.actions', async () => {
      atlas.action('dummy', DummyAction)
      await atlas.prepare()

      expect(atlas.actions).to.have.property('dummy')
      expect(atlas.actions.dummy).to.respondTo('dummyMethod')
    })
  })

  describe('Hook interactions - dispatching events', () => {
    beforeEach(() => {
      DummyService.prototype.prepare = sinon.stub().resolves()
      DummyHook.prototype.afterPrepare = sinon.stub().resolves()

      atlas.service('dummy', DummyService)
      atlas.hook('dummy', DummyHook)
    })

    it('calls the prepare hooks', async () => {
      await atlas.prepare()

      expect(DummyHook.prototype.afterPrepare).to.have.callCount(1)
    })

    it('calls the afterPrepare hook with the atlas instance', async () => {
      const proto = DummyHook.prototype
      await atlas.prepare()

      expect(proto.afterPrepare).to.have.been.calledWith(atlas)
    })

    it('can handle hooks which do not implement any listeners', async () => {
      class Empty {
        prepare() {}
      }

      atlas.hook('empty', Empty)
      // This not throwing will suffice 😎
      await atlas.prepare()
    })
  })
})
