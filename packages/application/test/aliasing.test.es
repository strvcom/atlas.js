import Application from '..'
import Service from '@theframework/service'
import Action from '@theframework/action'
import { FrameworkError } from '@theframework/errors'

class DummyAction extends Action {
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

describe('Application: cross-component communication', () => {
  let app

  beforeEach(() => {
    app = new Application({
      root: __dirname,
    })

    app.action('action', DummyAction, { aliases: {
      'service:dummy': 'service',
    } })
    app.service('service', DummyService, { aliases: {
      'action:dummy': 'action',
    } })

    return app.start()
  })

  it('service can find action', () => {
    app.services.service.sendPing('action:dummy')

    expect(app.actions.action.ping).to.have.callCount(1)
    expect(app.actions.action.ping).to.have.been.calledWith('action:dummy')
  })

  it('action can find service', () => {
    app.actions.action.sendPing('service:dummy')

    expect(app.services.service.ping).to.have.callCount(1)
    expect(app.services.service.ping).to.have.been.calledWith('service:dummy')
  })

  xit('hook can find action', () => {})
  xit('hook can find service', () => {})

  it('requesting unknown component throws', () => {
    expect(() => app.services.service.sendPing('service:lolsvc')).to.throw(FrameworkError)
  })
})
