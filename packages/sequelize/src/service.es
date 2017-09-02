import Service from '@atlas.js/service'
import Database from 'sequelize'

class Sequelize extends Service {
  static defaults = {
    uri: 'sqlite://atlas-db.sqlite',
    options: {},
  }

  prepare() {
    // Add a trace logger to allow users to monitor Sequelize activity
    this.config.options.logging = this::strace

    return new Database(this.config.uri, this.config.options)
  }

  async start(instance) {
    // Allow models to use the Atlas instance
    for (const Model of Object.values(instance.models)) {
      Model.atlas = this.app
    }

    await instance.authenticate()
  }

  async stop(instance) {
    await instance.close()
  }
}

function strace(...args) {
  this.log.trace({ args }, 'sequelize activity')
}

export default Sequelize
