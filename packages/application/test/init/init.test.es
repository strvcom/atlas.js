import path from 'path'
import Application from '../..'
import { FrameworkError } from '@theframework/errors'

describe('Application::init()', () => {
  it('exists', () => {
    expect(Application).itself.to.respondTo('init')
  })

  it('throws when no root is provided', () => {
    expect(() => Application.init({ env: 'test' }))
      .to.throw(FrameworkError, /root must be explicitly specified/)
  })

  it('loads all actions, hooks and services from the specified locations', async () => {
    const root = path.join(__dirname, 'demoapp')
    const app = Application.init({
      root,
      env: 'test',
      config: 'config',
      hooks: 'hooks',
      actions: 'actions',
      services: 'services',
    })

    await app.prepare()

    // Test it all!
    // @TODO (init): Find a way to test that the hooks have been loaded
    expect(app.services).to.have.all.keys(['dummy'])
    expect(app.actions).to.have.all.keys(['dummy'])
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

  it('provides defaults for paths to services, hooks, actions and config directories', () => {
    const root = path.join(__dirname, 'demoapp')
    const app = Application.init({
      root,
      env: 'test',
    })

    // Should not throw
    return app.prepare()
  })
})
