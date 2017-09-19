import { Service as Objection } from '../../src'
import Service from '@atlas.js/service'

describe('service initialization', () => {
  it('exists', () => {
    expect(Objection).to.be.a('function')
  })
  it('extends official Service', () => {
    const service = new Objection()
    expect(service).to.be.instanceof(Service)
  })
  it('sets default config', () => {
    expect(Objection.defaults).to.have.all.keys(['knex', 'options'])
    expect(Objection.defaults.knex).to.contain.all.keys(['connection', 'client'])
  })
})
