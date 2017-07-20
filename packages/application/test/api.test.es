import Application from '..'
import { FrameworkError } from '@theframework/errors'

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
