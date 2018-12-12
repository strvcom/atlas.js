import * as Sequelize from 'sequelize'
import { Service as Database } from '../..'

describe('Sequelize::prepare()', () => {
  let service
  let instance

  beforeEach(async () => {
    service = new Database({
      atlas: {},
      log: {
        trace: sinon.stub(),
      },
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
  })

  it('prints the SQL statements Sequelize executes at trace level using the service logger', () => {
    const example = 'Executing (default): SELECT 1 + 1'
    const fn = instance.options.logging

    fn(example)

    expect(service.log.trace).to.have.callCount(1)
    expect(service.log.trace).to.have.been.calledWith({ sql: 'SELECT 1 + 1' })
  })
})
