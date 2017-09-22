import Application from '..'
import { FrameworkError } from '@atlas.js/errors'

describe('Application: basics and API', () => {
  let opts

  beforeEach(() => {
    opts = { root: __dirname }
  })


  it('exists', () => {
    expect(Application).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Application(opts)).to.not.throw()
  })

  it('requires root on construction', () => {
    expect(() => new Application()).to.throw(FrameworkError, /root must be explicitly specified/)
  })

  it('throws when env is not provided and NODE_ENV is not set', function() {
    // eslint-disable-next-line no-process-env
    this.sandbox.stub(process.env, 'NODE_ENV').value('')
    expect(() => new Application(opts)).to.throw(FrameworkError, /env not specified/)
  })

  it('supports loading the config from module path relative to root', () => {
    // Sanity check
    const modules = {
      /* eslint-disable global-require */
      base: require('./democonfig'),
      env: require('./democonfig/env/lolenv'),
      local: require('./democonfig/local'),
      /* eslint-enable global-require */
    }
    expect(modules.base.application).to.have.property('fromBase', true)
    expect(modules.base.application).to.have.property('fromEnv', false)
    expect(modules.base.application).to.have.property('fromLocal', false)
    expect(modules.env.application).to.have.property('fromEnv', true)
    expect(modules.env.application).to.have.property('fromLocal', false)
    expect(modules.local.application).to.have.property('fromLocal', true)

    const app = new Application({
      root: __dirname,
      env: 'lolenv',
      config: 'democonfig',
    })
    const config = app.config.application

    expect(config).to.have.property('fromBase', true)
    expect(config).to.have.property('fromEnv', true)
    expect(config).to.have.property('fromLocal', true)
  })

  it('prefers ES module default export in the config files', () => {
    const modules = {
      // eslint-disable-next-line global-require
      env: require('./democonfig/env/modenv').default,
    }

    expect(modules.env.application).to.have.property('fromEnv', true)
    expect(modules.env.application).to.have.property('fromLocal', false)

    const app = new Application({
      root: __dirname,
      env: 'modenv',
      config: 'democonfig',
    })
    const config = app.config.application

    expect(config).to.have.property('fromBase', true)
    expect(config).to.have.property('fromEnv', true)
    expect(config).to.have.property('fromLocal', true)
  })

  it('responds to known methods', () => {
    const app = new Application(opts)

    expect(app).to.respondTo('prepare')
    expect(app).to.respondTo('start')
    expect(app).to.respondTo('stop')
  })

  it('has known public properties', () => {
    const app = new Application(opts)

    expect(app).to.include.all.keys([
      'actions',
      'services',
      'config',
      'log',
    ])
    // Implemented as getters, and Chai does not seem to work with them when checking for .keys()
    // eslint-disable-next-line no-process-env
    expect(app.env).to.equal(process.env.NODE_ENV).and.to.be.a('string')
    expect(app.root).to.equal(__dirname)
    expect(app.prepared).to.equal(false)
    expect(app.started).to.equal(false)
  })

  it('constructs a log object on this.log', () => {
    const app = new Application(opts)

    expect(app).to.have.property('log')
    expect(app.log).to.respondTo('debug')
    expect(app.log).to.respondTo('info')
    expect(app.log).to.respondTo('warn')
    expect(app.log).to.respondTo('error')
  })

  it('prevents setting app.prepared', () => {
    const app = new Application(opts)

    expect(() => {
      app.prepared = true
    }).to.throw()
  })

  it('prevents setting app.started', () => {
    const app = new Application(opts)

    expect(() => {
      app.started = true
    }).to.throw()
  })
})
