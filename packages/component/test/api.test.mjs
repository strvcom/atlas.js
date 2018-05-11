import Component from '..'

describe('Component: basics and API', () => {
  it('exists', () => {
    expect(Component).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Component()).to.not.throw()
  })

  it('has a static config property with an empty object', () => {
    expect(Component.config).to.be.an('object')
    expect(Object.keys(Component.config)).to.have.length(0)
  })

  it('has a static defaults property with an empty object', () => {
    expect(Component.defaults).to.be.an('object')
    expect(Object.keys(Component.defaults)).to.have.length(0)
  })

  it('has a static requires property with an empty array', () => {
    expect(Component.requires).to.be.an('array')
    expect(Component.requires).to.have.length(0)
  })

  it('saves atlas, log and config objects given on constructor to itself', () => {
    const atlas = { atlas: true }
    const log = { log: true }
    const config = { config: true }
    const component = new Component({
      atlas,
      log,
      config,
    })

    expect(component).to.have.property('atlas', atlas)
    expect(component).to.have.property('log', log)
    expect(component).to.have.property('config', config)
  })

  it('saves the component function given on constructor to itself', () => {
    const resolve = () => {}
    const component = new Component({
      component: resolve,
    })

    expect(component).itself.to.respondTo('component')
  })

  it('saves the dispatch function given on constructor to itself', () => {
    const dispatch = () => {}
    const component = new Component({ dispatch })

    expect(component).itself.to.respondTo('dispatch')
    expect(component.dispatch).to.eql(dispatch)
  })
})
