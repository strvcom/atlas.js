import path from 'path'
import { Service as Objection } from '../..'

describe('Objection::start()', () => {
  let service
  let instance
  let opts


  beforeEach(async function() {
    opts = {
      atlas: {
        require: sinon.stub().returns(models),
      },
      log: {},
      config: {
        knex: {
          client: 'sqlite3',
          useNullAsDefault: true,
        },
        models: path.resolve(__dirname, './models'),
      },
    }
    service = new Objection(opts)
    instance = await service.prepare()
    this.sandbox.stub(instance.connection, 'raw').resolves()

    await service.start(instance)
  })


  it('exists', () => {
    expect(service.start).to.be.a('function')
  })

  it('executes a raw query to ensure connectivity', () => {
    expect(instance.connection.raw).to.have.callCount(1)
  })
})
