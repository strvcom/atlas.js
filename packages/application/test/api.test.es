import Application from '..'

describe('Application: basics and API', () => {
  it('exists', () => {
    expect(Application).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Application()).to.not.throw()
  })

  it('responds to known methods', () => {
    const app = new Application()

    expect(app).to.respondTo('prepare')
    expect(app).to.respondTo('start')
    expect(app).to.respondTo('stop')
  })

  it('has known public properties', () => {
    const app = new Application()

    expect(app).to.include.all.keys([
      'services',
      'config',
      'log',
    ])
    // Implemented as getters, and Chai does not seem to work with them when checking for .keys()
    expect(app.prepared).to.equal(false)
    expect(app.started).to.equal(false)
  })

  it('constructs a log object on this.log', () => {
    const app = new Application()

    expect(app).to.have.property('log')
    expect(app.log).to.respondTo('debug')
    expect(app.log).to.respondTo('info')
    expect(app.log).to.respondTo('warn')
    expect(app.log).to.respondTo('error')
  })

  it('prevents setting app.prepared', () => {
    const app = new Application()

    expect(() => {
      app.prepared = true
    }).to.throw()
  })

  it('prevents setting app.started', () => {
    const app = new Application()

    expect(() => {
      app.started = true
    }).to.throw()
  })
})
