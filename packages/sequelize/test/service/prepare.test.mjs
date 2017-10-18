import { Service as Database } from '../..'
import Sequelize from 'sequelize'

describe('Sequelize::prepare()', () => {
  let service
  let instance

  beforeEach(async () => {
    service = new Database({
      atlas: {},
      log: {},
      config: {
        uri: 'sqlite://test-db.sqlite',
        options: {
          operatorsAliases: {},
        },
      },
    })

    instance = await service.prepare()
  })

  afterEach(() =>
    service.stop(instance))


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns Sequelize instance', () => {
    expect(instance).to.be.instanceof(Sequelize)
  })

  it('sets a debug function to log sequelize events', () => {
    expect(instance.options.logging).to.be.a('function')
    // eslint-disable-next-line no-console
    expect(instance.options.logging).to.not.equal(console.log)
  })
})
