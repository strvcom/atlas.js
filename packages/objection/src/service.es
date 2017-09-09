import Service from '@atlas.js/service'
import objection from 'objection'
import knex from 'knex'

class Objection extends Service {
  static defaults = {
    knex: {
      connection: 'database_url_string',
      client: 'postgresql',
    },
    options: {},
  }

  prepare() {
    const connection = knex(this.config.knex)
    objection.Model.knex(connection)
    /**
     * instance is built the same way as e.g sequelize
     * objection module is a part of it
     */
    const database = {
      objection,
    }
    return database
  }

  async start(instance) {
    instance.atlas = this.app
    await instance.objection.raw('select 1 + 1')
  }

  async stop(instance) {
    await instance.objection.Model.knex().destroy()
  }
}

export default Objection
