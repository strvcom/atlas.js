import path from 'path'
import Hook from '@atlas.js/hook'
import { mapKeys, snakeCase, camelCase, has, cloneDeep } from 'lodash'
import { FrameworkError } from '@atlas.js/errors'

function makeTransformerClassFrom(model) {
  return class extends model {
    $parseDatabaseJson(json) {
      json = mapKeys(json, (value, key) => camelCase(key))
      return super.$parseDatabaseJson(json)
    }
    $formatDatabaseJson(json) {
      json = super.$formatDatabaseJson(json)
      return mapKeys(json, (value, key) => snakeCase(key))
    }
  }
}

class ModelsHook extends Hook {
  static defaults = {
    module: 'models',
  }

  static requires = [
    'service:objection',
  ]

  'application:prepare:after'() {
    const database = this.component('service:objection')

    // eslint-disable-next-line global-require
    const modelConfigs = require(path.resolve(this.app.root, this.config.module))
    const models = {}

    const Model = database.objection.Model
    const CamelCaseTransformer = makeTransformerClassFrom(Model)
    for (const [name, params] of Object.entries(modelConfigs)) {
      models[name] = class extends CamelCaseTransformer {
        static tableName = params.tableName
        static jsonSchema = params.jsonSchema
      }
    }

    // at this point basic models should be initialized -> relations
    for (const [name, params] of Object.entries(modelConfigs)) {
      if (params.relationMappings) {
        // add the verified static method
        const mappings = {}
        for (const [alias, { relation, modelClass, join }] of Object.entries(params.relationMappings)) {
          if (!relation || !has(Model, relation)) {
            throw new FrameworkError(`Invalid relation of type ${relation}`)
          }
          if (!modelClass || !has(models, modelClass)) {
            throw new FrameworkError(`Model ${modelClass} does not exist!`)
          }
          const joinCopy = cloneDeep(join)
          // Many-to-many relation can contain modelClass in the through field
          if (relation === 'ManyToManyRelation' && has(join.through, 'modelClass')) {
            if (!has(models, join.through.modelClass)) {
              throw new FrameworkError(`Model ${join.through.modelClass} does not exist!`)
            }
            joinCopy.through.modelClass = models[join.through.modelClass]
          }

          mappings[alias] = {}
          mappings[alias].relation = Model[relation]
          mappings[alias].modelClass = models[modelClass]
          mappings[alias].join = joinCopy
        }
        models[name].relationMappings = mappings
      }
    }

    database.models = models
  }
}

export default ModelsHook
