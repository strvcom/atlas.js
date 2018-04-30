import { Atlas } from '..'
import Service from '@atlas.js/service'
import Action from '@atlas.js/action'
import { FrameworkError } from '@atlas.js/errors'

describe('Atlas: cross-component communication', () => {
  let atlas

  beforeEach(() => {
    atlas = new Atlas({
      root: __dirname,
      config: { atlas: { log: {
        level: 'warn',
      } } },
    })
  })

  it('service can find action', async () => {
    class DummyService extends Service {
      static requires = ['action:dummy']

      start() {
        this.component('action:dummy').ping('service:dummy')
      }
    }

    class DummyAction extends Action {}

    DummyAction.prototype.ping = sinon.stub()

    atlas.service('dummy', DummyService, { aliases: { 'action:dummy': 'dummy' } })
    atlas.action('dummy', DummyAction)

    await atlas.start()

    expect(DummyAction.prototype.ping).to.have.callCount(1)
    expect(DummyAction.prototype.ping).to.have.been.calledWith('service:dummy')
  })

  it('action can find service', async () => {
    const api = {
      ping: sinon.stub(),
    }

    class DummyService extends Service {
      prepare() { return api }
    }

    class DummyAction extends Action {
      static requires = ['service:dummy']
      ping() { this.component('service:dummy').ping('action:dummy') }
    }

    atlas.service('dummy', DummyService)
    atlas.action('dummy', DummyAction, { aliases: { 'service:dummy': 'dummy' } })

    await atlas.start()
    atlas.actions.dummy.ping()

    expect(api.ping).to.have.callCount(1)
    expect(api.ping).to.have.been.calledWith('action:dummy')
  })

  it('requesting unknown component throws', async () => {
    class DummyAction extends Action {
      ping(alias) {
        this.component(alias)
      }
    }
    atlas.action('dummy', DummyAction)
    await atlas.start()

    expect(() => atlas.actions.dummy.ping('service:lolsvc')).to.throw(FrameworkError)
  })
})
