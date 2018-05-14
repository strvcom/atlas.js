import knex from 'knex'
import Service from '@atlas.js/service'
import { FrameworkError } from '@atlas.js/errors'

class Objection extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    required: ['knex', 'models'],
    properties: {
      knex: {
        type: 'object',
        required: ['client'],
        properties: {
          // @TODO: Allow functions as valid client
          client: {
            type: 'string',
            enum: [
              'mariadb',
              'mariasql',
              'pg',
              'postgresql',
              'sqlite',
            ],
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

  prepare() {
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
      for (const relation of Object.values(Model.relationMappings || {})) {
        const target = relation.modelClass

        if (typeof target !== 'string') {
          continue
        }

        if (!(target in models)) {
          throw new FrameworkError(`Unable to find relation ${target} defined in ${Model.name}`)
        }

        relation.modelClass = models[target]
      }
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

export default Objection
