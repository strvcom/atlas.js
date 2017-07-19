import Hook from '..'

describe('Hook: basics and API', () => {
  it('exists', () => {
    expect(Hook).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Hook()).to.not.throw()
  })

  it('has a static defaults property with an empty object', () => {
    expect(Hook.defaults).to.be.an('object')
    expect(Object.keys(Hook.defaults)).to.have.length(0)
  })

  it('implements methods each Hook should have', () => {
    const hook = new Hook()

    expect(hook).to.respondTo('prepare')
  })

  it('all those methods return a promise', () => {
    const hook = new Hook()

    expect(hook.prepare()).to.be.a('promise')
  })

  it('saves app log and config objects given on constructor to itself', () => {
    const app = { app: true }
    const log = { log: true }
    const config = { config: true }
    const hook = new Hook({
      app,
      log,
      config,
    })

    expect(hook).to.have.property('app', app)
    expect(hook).to.have.property('log', log)
    expect(hook).to.have.property('config', config)
  })
})
