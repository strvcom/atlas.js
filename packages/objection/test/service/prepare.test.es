import { Service as DbService } from '../../src'
import objection from 'objection'

const serviceConfig = {
  knex: {
    connection: {
      filename: './mydb.sqlite',
    },
    useNullAsDefault: true,
    client: 'sqlite3',
  },
  options: {},
}

describe('objection.prepare()', () => {
  let service
  let instance

  beforeEach(async () => {
    service = new DbService({
      app: {},
      config: serviceConfig,
    })
    instance = await service.prepare()
  })
  afterEach(() => service.stop(instance))

  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns instance in proper format', () => {
    expect(instance).to.have.all.keys(['objection'])
  })

  it('binds knex connection', async function() {
    this.sb.each.spy(objection.Model, 'knex')
    const inst = await service.prepare()
    expect(inst.objection.Model.knex).to.have.callCount(1)
  })
})
