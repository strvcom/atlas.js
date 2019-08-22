import Hook from '@atlas.js/hook'
import Action from '@atlas.js/action'
import { Atlas } from '..'

class DummyHook extends Hook {
  static observes = 'action:dummy'
}

class AnotherHook extends Hook {
  static observes = 'action:dummy'
}

class UnrelatedHook extends Hook {
  static observes = 'action:unrelated'
}

class DummyAction extends Action {
  trigger(event, ctx) {
    return this.dispatch(event, ctx)
  }
}

class UnrelatedAction extends Action {}

describe('Hook: custom events', () => {
  let atlas

  before(() => {
    atlas = new Atlas({
      root: __dirname,
      config: {
        atlas: { log: { level: 'warn' } },
      },
    })
    atlas.hook('dummy', DummyHook, { aliases: { 'action:dummy': 'dummy' } })
    atlas.hook('another', AnotherHook, { aliases: { 'action:dummy': 'dummy' } })
    atlas.hook('unrelated', UnrelatedHook, { aliases: { 'action:unrelated': 'unrelated' } })
    atlas.action('dummy', DummyAction)
    atlas.action('unrelated', UnrelatedAction)

    return atlas.start()
  })

  beforeEach(() => {
    DummyHook.prototype.handleEvent = sinon.stub()
    AnotherHook.prototype.handleEvent = sinon.stub()
    UnrelatedHook.prototype.handleEvent = sinon.stub()
  })


  it('dispatches a custom event from a component to all observing hooks', async () => {
    const ctx = {}

    await atlas.actions.dummy.trigger('handleEvent', ctx)

    expect(DummyHook.prototype.handleEvent).to.have.callCount(1)
    expect(DummyHook.prototype.handleEvent).to.have.been.calledWith(ctx)
    expect(AnotherHook.prototype.handleEvent).to.have.callCount(1)
    expect(AnotherHook.prototype.handleEvent).to.have.been.calledWith(ctx)
  })

  it('does not dispatch the event to hooks not observing the component', async () => {
    await atlas.actions.dummy.trigger('handleEvent')

    expect(UnrelatedHook.prototype.handleEvent).to.have.callCount(0)
  })

  it('does not crash if some hook does not handle the dispatched event', () => {
    DummyHook.prototype.handleOtherEvent = sinon.stub()

    return expect(atlas.actions.dummy.trigger('handleOtherEvent'))
      .to.not.eventually.be.rejectedWith(Error)
  })

  it('still resolves even if one of the hooks throws', async () => {
    atlas = new Atlas({
      root: __dirname,
      config: {
        atlas: { log: { level: 'fatal' } },
      },
    })
    atlas.hook('dummy', DummyHook, { aliases: { 'action:dummy': 'dummy' } })
    atlas.hook('another', AnotherHook, { aliases: { 'action:dummy': 'dummy' } })
    atlas.action('dummy', DummyAction)

    await atlas.start()

    DummyHook.prototype.handleEvent = sinon.stub().resolves()
    AnotherHook.prototype.handleEvent = sinon.stub().rejects(new Error('u-oh'))

    return expect(atlas.actions.dummy.trigger('handleEvent'))
      .to.not.be.eventually.rejectedWith(Error)
  })
})
