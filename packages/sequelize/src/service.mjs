import Service from '@atlas.js/service'
import * as Database from 'sequelize'

class Sequelize extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    default: {},
    properties: {
      uri: {
        type: 'string',
        default: 'sqlite://atlas-db.sqlite',
      },
      options: {
        type: 'object',
      },
    },
  }

  prepare() {
    // Add a trace logger to allow users to monitor Sequelize activity
    this.config.options.logging = this::strace

    return Promise.resolve(new Database(this.config.uri, this.config.options))
  }

  async start(instance) {
    // @TODO(semver-major): remove this and keep it in the ModelsHook
    // Allow models to use the Atlas instance
    for (const Model of Object.values(instance.models)) {
      Model.atlas = this.atlas
      Model.prototype.atlas = this.atlas
    }

    await instance.authenticate()
  }

  async stop(instance) {
    await instance.close()
  }
}

function strace(sql) {
  // Remove the initial "Executing (default): prefix to keep only the SQL statement"
  sql = sql.slice(sql.indexOf(':') + 1).trim()
  this.log.trace({ sql }, 'sequelize activity')
}

export default Sequelize
