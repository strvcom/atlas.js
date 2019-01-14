import * as knex from 'knex'
import Service from '@atlas.js/service'
import { FrameworkError } from '@atlas.js/errors'

class Objection extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    default: {},
    required: ['knex', 'models'],
    properties: {
      knex: {
        type: 'object',
        required: ['client'],
        properties: {
          client: {
            oneOf: [{
              type: 'string',
              enum: [
                'mariadb',
                'mariasql',
                'pg',
                'postgresql',
                'sqlite',
              ],
            }, {
              typeof: 'function',
            }],
          },
        },
      },
      models: {
        type: 'string',
        default: 'models',
      },
      prefetch: {
        type: 'boolean',
        default: true,
      },
    },
  }

  // eslint-disable-next-line require-await
  async prepare() {
    const models = this.atlas.require(this.config.models) || {}
    const connection = knex(this.config.knex)
    const client = {
      connection,
      models: {},
    }

    // Fix relative model references to be absolute
    // We must do this for all models before we start binding knex to them otherwise Objection will
    // complain
    for (const Model of Object.values(models)) {
      walk(Model.relationMappings, key => key === 'modelClass', target => {
        if (typeof target !== 'string') {
          return target
        }

        if (!(target in models)) {
          throw new FrameworkError(`Unable to find relation ${target} defined in ${Model.name}`)
        }

        return models[target]
      })
    }

    for (const [name, Model] of Object.entries(models)) {
      // We need to bind the models this way so that in the rare event there are two objection
      // components using the same models we avoid knex being re-bound on the same models.
      client.models[name] = Model.bindKnex(connection)
      // Expose Atlas to the models
      client.models[name].atlas = this.atlas
      client.models[name].prototype.atlas = this.atlas
    }

    return client
  }

  async start(client) {
    // There is no official "connect()" or similar method, so let's just do a raw query to make sure
    // the connection is open.
    await client.connection.raw('select 1 + 1')

    // Prefetch all models' table metadata to avoid fetching them during actual requests
    await this.config.prefetch
      ? Promise.all(Object.values(client.models).map(Model => Model.fetchTableMetadata()))
      : void 0
  }

  async stop(client) {
    await client.connection.destroy()
  }
}

function walk(obj = {}, filter = () => false, replace = () => {}) {
  for (const [key, value] of Object.entries(obj || {})) {
    if (typeof value === 'object' && Boolean(value)) {
      walk(obj[key], filter, replace)
      continue
    }

    // Ignore function values
    if (typeof value === 'function') {
      continue
    }

    if (filter(key)) {
      // Got a key which is not an object or a function!
      obj[key] = replace(value)
    }
  }
}

export default Objection
