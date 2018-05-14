import { Atlas } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Service as Sequelize } from '../..'

describe('Service: Sequelize', () => {
  it('exists', () => {
    expect(Sequelize).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Sequelize()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(Sequelize.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() => atlas.service('sequelize', Sequelize)).to.not.throw()
  })
})
