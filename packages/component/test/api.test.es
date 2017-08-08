import Component from '..'

describe('Component: basics and API', () => {
  it('exists', () => {
    expect(Component).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Component()).to.not.throw()
  })

  it('has a static defaults property with an empty object', () => {
    expect(Component.defaults).to.be.an('object')
    expect(Object.keys(Component.defaults)).to.have.length(0)
  })

  it('has a static requires property with an empty array', () => {
    expect(Component.requires).to.be.an('array')
    expect(Component.requires).to.have.length(0)
  })

  it('saves app, log and config objects given on constructor to itself', () => {
    const app = { app: true }
    const log = { log: true }
    const config = { config: true }
    const component = new Component({
      app,
      log,
      config,
    })

    expect(component).to.have.property('app', app)
    expect(component).to.have.property('log', log)
    expect(component).to.have.property('config', config)
  })

  it('saves the resolve function given on constructor to itself', () => {
    const resolve = () => {}
    const component = new Component({
      resolve,
    })

    expect(component).itself.to.respondTo('component')
  })
})
