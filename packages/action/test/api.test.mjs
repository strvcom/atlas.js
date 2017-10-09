import Action from '..'

describe('Action: basics and API', () => {
  it('exists', () => {
    expect(Action).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Action()).to.not.throw()
  })

  it('has a static defaults property with an empty object', () => {
    expect(Action.defaults).to.be.an('object')
    expect(Object.keys(Action.defaults)).to.have.length(0)
  })

  it('has static type property se to action', () => {
    expect(Action.type).to.equal('action')
  })

  it('saves atlas, log and config objects given on constructor to itself', () => {
    const atlas = { atlas: true }
    const log = { log: true }
    const config = { config: true }
    const action = new Action({
      atlas,
      log,
      config,
    })

    expect(action).to.have.property('atlas', atlas)
    expect(action).to.have.property('log', log)
    expect(action).to.have.property('config', config)
  })
})
