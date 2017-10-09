import { Atlas } from '..'
import { FrameworkError } from '@atlas.js/errors'

describe('Atlas: basics and API', () => {
  let opts

  beforeEach(() => {
    opts = { root: __dirname }
  })


  it('exists', () => {
    expect(Atlas).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Atlas(opts)).to.not.throw()
  })

  it('requires root on construction', () => {
    expect(() => new Atlas()).to.throw(FrameworkError, /root must be explicitly specified/)
  })

  it('throws when env is not provided and NODE_ENV is not set', function() {
    // eslint-disable-next-line no-process-env
    this.sandbox.stub(process.env, 'NODE_ENV').value('')
    expect(() => new Atlas(opts)).to.throw(FrameworkError, /env not specified/)
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
    expect(modules.base.atlas).to.have.property('fromBase', true)
    expect(modules.base.atlas).to.have.property('fromEnv', false)
    expect(modules.base.atlas).to.have.property('fromLocal', false)
    expect(modules.env.atlas).to.have.property('fromEnv', true)
    expect(modules.env.atlas).to.have.property('fromLocal', false)
    expect(modules.local.atlas).to.have.property('fromLocal', true)

    const atlas = new Atlas({
      root: __dirname,
      env: 'lolenv',
      config: 'democonfig',
    })
    const config = atlas.config.atlas

    expect(config).to.have.property('fromBase', true)
    expect(config).to.have.property('fromEnv', true)
    expect(config).to.have.property('fromLocal', true)
  })

  it('prefers ES module default export in the config files', () => {
    const modules = {
      // eslint-disable-next-line global-require
      env: require('./democonfig/env/modenv').default,
    }

    expect(modules.env.atlas).to.have.property('fromEnv', true)
    expect(modules.env.atlas).to.have.property('fromLocal', false)

    const atlas = new Atlas({
      root: __dirname,
      env: 'modenv',
      config: 'democonfig',
    })
    const config = atlas.config.atlas

    expect(config).to.have.property('fromBase', true)
    expect(config).to.have.property('fromEnv', true)
    expect(config).to.have.property('fromLocal', true)
  })

  it('responds to known methods', () => {
    const atlas = new Atlas(opts)

    expect(atlas).to.respondTo('prepare')
    expect(atlas).to.respondTo('start')
    expect(atlas).to.respondTo('stop')
  })

  it('has known public properties', () => {
    const atlas = new Atlas(opts)

    expect(atlas).to.include.all.keys([
      'actions',
      'services',
      'config',
      'log',
    ])
    // Implemented as getters, and Chai does not seem to work with them when checking for .keys()
    // eslint-disable-next-line no-process-env
    expect(atlas.env).to.equal(process.env.NODE_ENV).and.to.be.a('string')
    expect(atlas.root).to.equal(__dirname)
    expect(atlas.prepared).to.equal(false)
    expect(atlas.started).to.equal(false)
  })

  it('constructs a log object on this.log', () => {
    const atlas = new Atlas(opts)

    expect(atlas).to.have.property('log')
    expect(atlas.log).to.respondTo('debug')
    expect(atlas.log).to.respondTo('info')
    expect(atlas.log).to.respondTo('warn')
    expect(atlas.log).to.respondTo('error')
  })

  it('prevents setting atlas.prepared', () => {
    const atlas = new Atlas(opts)

    expect(() => {
      atlas.prepared = true
    }).to.throw()
  })

  it('prevents setting atlas.started', () => {
    const atlas = new Atlas(opts)

    expect(() => {
      atlas.started = true
    }).to.throw()
  })
})
