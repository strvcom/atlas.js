import path from 'path'
import Application from '../..'
import { FrameworkError } from '@theframework/errors'
import * as testservices from './demoapp/services'
import * as testactions from './demoapp/actions'
import * as testhooks from './demoapp/hooks'
import * as testaliases from './demoapp/aliases'

describe('Application::init()', () => {
  beforeEach(function() {
    this.sb.each.stub(Application.prototype, 'action').returnsThis()
    this.sb.each.stub(Application.prototype, 'hook').returnsThis()
    this.sb.each.stub(Application.prototype, 'service').returnsThis()
  })


  it('exists', () => {
    expect(Application).itself.to.respondTo('init')
  })

  it('throws when no root is provided', () => {
    expect(() => Application.init({ env: 'test' }))
      .to.throw(FrameworkError, /root must be explicitly specified/)
  })

  it('does not throw TypeError when options is not provided', () => {
    expect(() => Application.init()).to.not.throw(TypeError)
  })

  it('loads all actions, hooks and services from the specified locations', () => {
    const proto = Application.prototype
    const root = path.resolve(__dirname, 'demoapp')
    const app = Application.init({
      root,
      env: 'test',
      config: 'config',
      hooks: 'hooks',
      actions: 'actions',
      services: 'services',
      aliases: 'aliases',
    })

    // Test services
    for (const [name, Component] of Object.entries(testservices)) {
      const aliases = testaliases.services[name]
      expect(proto.service).to.have.been.calledWith(name, Component, { aliases })
    }
    // Test actions
    for (const [name, Component] of Object.entries(testactions)) {
      const aliases = testaliases.actions[name]
      expect(proto.action).to.have.been.calledWith(name, Component, { aliases })
    }
    // Test hooks
    for (const [name, Component] of Object.entries(testhooks)) {
      const aliases = testaliases.hooks[name]
      expect(proto.hook).to.have.been.calledWith(name, Component, { aliases })
    }

    // Stuff directly on app
    expect(app.config).to.have.all.keys(['application', 'services', 'hooks', 'actions'])
    expect(app.config.application).to.include.keys(['test', 'override'])
    expect(app.config.services).to.eql({ dummy: {
      test: true,
      override: true,
    } })
    expect(app.config.hooks).to.eql({ dummy: {
      test: true,
      override: true,
    } })
    expect(app.config.actions).to.eql({ dummy: {
      test: true,
      override: true,
    } })
  })

  it('provides defaults for paths to services, hooks, actions, aliases and config dirs', () => {
    const root = path.resolve(__dirname, 'demoapp')
    const app = Application.init({
      root,
      env: 'test',
    })

    // Should not throw
    return app.prepare()
  })
})
