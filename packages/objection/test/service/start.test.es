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

describe('objection.start()', () => {
  let service
  let instance

  beforeEach(async function() {
    service = new Objection({
      app: {},
      config: serviceConfig,
    })
    instance = await service.prepare()
    this.sb.each.stub(instance.objection, 'raw').resolves()
  })
  afterEach(() => service.stop(instance))

  it('exists', () => {
    expect(service).to.respondTo('start')
  })

  it('adds atlas to the db instance', async () => {
    await service.start(instance)
    expect(instance).to.contain.all.keys(['atlas'])
  })

  it('tests the db connection', async () => {
    await service.start(instance)
    expect(instance.objection.raw).to.have.callCount(1)
    const call = instance.objection.raw.getCall(0).args
    // first argument of the first call
    expect(call[0]).to.equal('select 1 + 1')
  })
})
