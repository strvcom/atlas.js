import { Service as Objection } from '../../src'

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

describe('objection.stop()', () => {
  let service
  let instance

  beforeEach(async function() {
    service = new Objection({
      app: {},
      config: serviceConfig,
    })
    instance = await service.prepare()
    this.sb.each.stub(instance.objection.Model.knex(), 'destroy').resolves()
  })
  afterEach(() => service.stop(instance))

  it('exists', () => {
    expect(service).to.respondTo('stop')
  })

  it('calls knex.destroy() to end the connection', async () => {
    await service.stop(instance)
    expect(instance.objection.Model.knex().destroy).to.have.callCount(1)
  })
})
