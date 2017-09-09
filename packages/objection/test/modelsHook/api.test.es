import { ModelsHook } from '../..'
import objection from 'objection'
import knex from 'knex'
import * as models from '../testmodels'
import { FrameworkError } from '@atlas.js/errors'

describe('objection: modelsHook', () => {
  let database
  let hook

  before(() => {
    const connection = knex({
      connection: {
        filename: './mydb.sqlite',
      },
      useNullAsDefault: true,
      client: 'sqlite3',
    })
    objection.Model.knex(connection)
    database = { objection }
  })
  after(() => database.objection.Model.knex().destroy())

  beforeEach(() => {
    hook = new ModelsHook({
      app: {
        root: __dirname,
      },
      log: { debug() {} },
      config: {
        module: '../testmodels',
      },
      resolve() { return database },
    })
  })

  it('exists', () => {
    expect(ModelsHook).to.be.a('function')
  })

  it('defines required components', () => {
    expect(ModelsHook.requires).to.eql([
      'service:objection',
    ])
  })

  it('implements `application:prepare:after`', () => {
    expect(hook).to.respondTo('application:prepare:after')
  })

  describe('application:prepare:after()', () => {
    it('loads all models from specified location', async () => {
      await hook['application:prepare:after']()

      for (const [name, params] of Object.entries(models)) {
        expect(database.models).to.have.property(name)
        expect(database.models[name].tableName).to.equal(params.tableName)
        expect(database.models[name].jsonSchema).to.equal(params.jsonSchema)
      }
    })

    it('replaces model names to actual model classes', async () => {
      await hook['application:prepare:after']()
      for (const [name, model] of Object.entries(models)) {
        const transformedModel = database.models[name]

        // empty is an arbitrary name of model config
        if (name === 'empty') {
          // not all models must have relation
          expect(Object.keys(transformedModel)).to.not.have.all.keys(['relationMappings'])
        } else {
          expect(transformedModel).to.have.property('relationMappings')
          for (const [alias, params] of Object.entries(model.relationMappings)) {
            expect(Object.keys(transformedModel.relationMappings)).to.include(alias)
            expect(params).to.have.property('relation')

            const transformed = transformedModel.relationMappings[alias]
            expect(transformed.relation).to.be.a('function')
            expect(transformed.modelClass).to.be.a('function')
            // cannot find a way to retrieve class expressions name :(
            expect(transformed.join).to.be.a('object')
            if (params.relation === 'ManyToManyRelation' && params.join.through.modelClass) {
              expect(params.join.through.modelClass).to.be.a('string')
              expect(transformed.join.through.modelClass).to.be.a('function')
            }
          }
        }
      }
    })

    it('checks custom prototype methods - snake_case - camelCase transform', async () => {
      await hook['application:prepare:after']()
      const user = database.models.user
      // eslint-disable-next-line camelcase
      const dbRow = { user_type_id: 1 }
      const appRow = { userTypeId: 1 }
      expect(user.prototype.$parseDatabaseJson(dbRow)).to.eql(appRow)
      expect(user.prototype.$formatDatabaseJson(appRow)).to.eql(dbRow)
    })

    it('throws FrameworkError when user sets unknown relation', () => {
      models.movie.relationMappings.likers.relation = 'UnknownRelation'
      expect(() => hook['application:prepare:after']())
        .to.throw(FrameworkError, /Invalid relation of type UnknownRelation/)
      models.movie.relationMappings.likers.relation = 'ManyToManyRelation'
    })

    it('throws FrameworkError when join.through.modelClass is unknown', () => {
      models.movie.relationMappings.likers.join.through.modelClass = 'unknown'
      expect(() => hook['application:prepare:after']())
        .to.throw(FrameworkError, /Model unknown does not exist/)
      models.movie.relationMappings.likers.join.through.modelClass = 'movieLike'
    })

    it('throws Framework error when trying to map unknown model', () => {
      models.user.relationMappings.myType.modelClass = 'unknown'
      expect(() =>
        hook['application:prepare:after']())
        .to.throw(FrameworkError, /Model unknown does not exist/)
      models.user.relationMappings.myType.modelClass = 'userType'
    })
  })
})
