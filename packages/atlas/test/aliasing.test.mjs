import { Atlas } from '..'
import Service from '@atlas.js/service'
import Action from '@atlas.js/action'
import { FrameworkError } from '@atlas.js/errors'

class DummyAction extends Action {
  static requires = ['service:dummy']

  constructor(options) {
    super(options)
    this.ping = sinon.spy()
  }

  sendPing(alias) {
    const component = this.component(alias)
    component.ping(alias)
  }
}
class DummyService extends Service {
  static requires = ['action:dummy']

  prepare() {
    super.prepare()
    return {
      ping: sinon.spy(),
      sendPing: alias => {
        const component = this.component(alias)
        component.ping(alias)
      },
    }
  }
}

describe('Atlas: cross-component communication', () => {
  let atlas

  beforeEach(() => {
    atlas = new Atlas({
      root: __dirname,
      config: { atlas: { log: {
        level: 'warn',
      } } },
    })

    atlas.action('action', DummyAction, { aliases: {
      'service:dummy': 'service',
    } })
    atlas.service('service', DummyService, { aliases: {
      'action:dummy': 'action',
    } })

    return atlas.start()
  })

  it('service can find action', () => {
    atlas.services.service.sendPing('action:dummy')

    expect(atlas.actions.action.ping).to.have.callCount(1)
    expect(atlas.actions.action.ping).to.have.been.calledWith('action:dummy')
  })

  it('action can find service', () => {
    atlas.actions.action.sendPing('service:dummy')

    expect(atlas.services.service.ping).to.have.callCount(1)
    expect(atlas.services.service.ping).to.have.been.calledWith('service:dummy')
  })

  xit('hook can find action', () => {})
  xit('hook can find service', () => {})

  it('requesting unknown component throws', () => {
    expect(() => atlas.services.service.sendPing('service:lolsvc')).to.throw(FrameworkError)
  })
})
