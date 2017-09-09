import { Service as DbService } from '../../src'
import Service from '@atlas.js/service'

describe('service initialization', () => {
  it('exists', () => {
    expect(DbService).to.be.a('function')
  })
  it('extends official Service', () => {
    const service = new DbService()
    expect(service).to.be.instanceof(Service)
  })
  it('sets default config', () => {
    expect(DbService.defaults).to.have.all.keys(['knex', 'options'])
    expect(DbService.defaults.knex).to.contain.all.keys(['connection', 'client'])
  })
})
