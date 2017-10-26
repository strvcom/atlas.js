import path from 'path'
import { Service as Objection } from '../..'

describe('Objection::stop()', () => {
  let service
  let instance


  beforeEach(async function() {
    service = new Objection({
      atlas: {
        require: sinon.stub(),
      },
      log: {},
      config: {
        knex: {
          client: 'sqlite3',
          useNullAsDefault: true,
        },
        models: path.resolve(__dirname, './models'),
      },
    })

    instance = await service.prepare()
    this.sandbox.stub(instance.connection, 'raw').resolves()
    this.sandbox.stub(instance.connection, 'destroy').resolves()

    await service.start(instance)
  })

  afterEach(() => service.stop(instance))


  it('exists', () => {
    expect(service.stop).to.be.a('function')
  })

  it('destroys the connection pool', async () => {
    await service.stop(instance)
    expect(instance.connection.destroy).to.have.callCount(1)
  })
})
