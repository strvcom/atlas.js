import path from 'path'
import { Service as Objection } from '../..'
import * as models from './models'

describe('Objection::start()', () => {
  let service
  let instance
  let opts


  beforeEach(async function() {
    for (const Model of Object.values(models)) {
      this.sandbox.stub(Model, 'fetchTableMetadata').resolves()
    }

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
        prefetch: true,
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

  it('prefetches table metadata for all models', () => {
    expect(Object.values(instance.models)).to.have.length(2)

    for (const Model of Object.values(instance.models)) {
      expect(Model.fetchTableMetadata).to.have.callCount(1)
    }
  })

  it('does not prefetch table metadata if prefetch: false', async function() {
    for (const Model of Object.values(models)) {
      Model.fetchTableMetadata.resetHistory()
    }

    opts.config.prefetch = false
    service = new Objection(opts)
    instance = await service.prepare()
    this.sandbox.stub(instance.connection, 'raw').resolves()
    // await service.start(instance)

    expect(Object.values(instance.models)).to.have.length(2)

    for (const Model of Object.values(instance.models)) {
      expect(Model.fetchTableMetadata).to.have.callCount(0)
    }
  })
})
