import Service from '@atlas.js/service'
import { Service as Objection } from '../..'

describe('Service: Objection', () => {
  it('exists', () => {
    expect(Objection).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Objection()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(Objection.defaults).to.have.all.keys([
      'knex',
      'models',
      'prefetch',
    ])
  })
})
