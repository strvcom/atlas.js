import Service from '@atlas.js/service'
import mongoose from 'mongoose'

class Mongoose extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    default: {},
    properties: {
      uri: {
        type: 'string',
        default: 'mongodb://127.0.0.1:27017',
      },
      // see http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect
      options: {
        type: 'object',
        default: {},
        properties: {
          reconnectTries: { type: 'number' },
          reconnectInterval: { type: 'number' },
          poolSize: { type: 'number' },
        },
      },
    },
  }

  static defaults = {
    uri: 'mongodb://127.0.0.1:27017',
    options: {},
  }

  prepare() {
    const instance = new mongoose.Mongoose()
    // Add a trace logger to allow users to monitor Mongoose activity
    instance.set('debug', this::mtrace)

    return instance
  }

  async start(instance) {
    for (const name of instance.modelNames()) {
      // Allow models to use the Atlas instance
      instance.models[name].atlas = this.atlas
      instance.models[name].prototype.atlas = this.atlas
    }

    await instance.connect(this.config.uri, this.config.options)
  }

  async stop(instance) {
    await instance.disconnect()
  }
}

function mtrace(collection, method, ...args) {
  this.log.trace({ collection, method, args }, 'mongoose activity')
}

export default Mongoose
