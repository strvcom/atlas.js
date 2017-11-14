import path from 'path'
import { Service as Objection } from '../..'
import * as models from './models'

describe('Objection::prepare()', () => {
  let service
  let instance


  beforeEach(async () => {
    service = new Objection({
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
    })
    instance = await service.prepare()
  })


  it('exists', () => {
    expect(service.prepare).to.be.a('function')
  })

  it('returns an object with the models and the knex instance', () => {
    expect(instance).to.have.all.keys([
      'connection',
      'models',
    ])
  })

  it('loads the models from the given module location', () => {
    expect(service.atlas.require).to.have.callCount(1)
    expect(service.atlas.require).to.have.been.calledWith(service.config.models)
    expect(instance.models).to.have.all.keys([
      'ModelA',
      'ModelB',
    ])
  })

  it('resolves model names in relationship mappings to actual model classes', () => {
    for (const Model of Object.values(instance.models)) {
      // Sanity check
      expect(Model).to.have.property('relationMappings')
      expect(Object.keys(Model.relationMappings).length).to.be.greaterThan(0)

      for (const relation of Object.values(Model.relationMappings)) {
        expect(relation.modelClass).to.be.a('function')
      }
    }
  })

  it('exposes atlas instance as both static and instance property', () => {
    for (const Model of Object.values(instance.models)) {
      expect(Model).to.have.property('atlas')
      expect(Model.prototype).to.have.property('atlas')
    }
  })
})
