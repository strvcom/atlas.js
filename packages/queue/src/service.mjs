import Service from '@atlas.js/service'
import Queue from 'bee-queue'
import { defaultsDeep as defaults } from 'lodash'

const schemas = {
  redis: {
    type: 'object',
    properties: {
      host: { type: 'string' },
      port: { type: 'number' },
      db: { type: 'number' },
      options: { type: 'object' },
    },
  },
}

class Redis extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    required: ['queues'],
    properties: {
      queues: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name'],
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            config: {
              type: 'object',
              default: {},
              properties: {
                redis: schemas.redis,

                prefix: { type: 'string' },
                stallInterval: { type: 'number' },
                nearTermWindow: { type: 'number' },
                delayedDebounce: { type: 'number' },
                isWorker: { type: 'boolean' },
                getEvents: { type: 'boolean' },
                sendEvents: { type: 'boolean' },
                storeJobs: { type: 'boolean' },
                ensureScripts: { type: 'boolean' },
                activateDelayedJobs: { type: 'boolean' },
                removeOnSuccess: { type: 'boolean', default: true },
                removeOnFailure: { type: 'boolean' },
                redisScanCount: { type: 'number' },
              },
            },
          },
        },
      },

      redis: schemas.redis,
    },
  }


  prepare() {
    return {}
  }

  async start(client) {
    for (const definition of this.config.queues) {
      const queue = new Queue(definition.name, {
        ...definition.config,
        redis: defaults(this.config.redis, definition.config.redis),
      })

      client[definition.name] = queue
    }
  }

  async stop(client) {
    for (const queue of Object.values(client)) {
      queue.close()
    }
  }
}

export default Redis
