import Service from '@atlas.js/service'
import { Service as Sequelize } from '../..'

describe('Service: Sequelize', () => {
  it('exists', () => {
    expect(Sequelize).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Sequelize()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(Sequelize.defaults).to.have.all.keys([
      'uri',
      'options',
    ])
  })
})
