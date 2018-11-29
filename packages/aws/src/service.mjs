import Service from '@atlas.js/service'
import { defaultsDeep as defaults } from 'lodash'

class AWS extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    default: {},
    properties: {
      globals: {
        type: 'object',
        default: {},
        properties: {
          accessKeyId: { type: 'string' },
          secretAccessKey: { type: 'string' },
          region: { type: 'string' },
        },
      },
      services: {
        type: 'object',
        default: {},
      },
    },
  }

  prepare() {
    const aws = {}

    for (const [service, config] of Object.entries(this.config.services)) {
      defaults(config, this.config.globals)

      // For best performance and memory utilisation, only load the services from the SDK which are
      // actually needed. This is the official recommended way of loading specific services.
      // eslint-disable-next-line global-require
      const AWSService = require(`aws-sdk/clients/${service.toLowerCase()}`)

      aws[service] = new AWSService(config)
    }

    return Promise.resolve(aws)
  }

  stop() {
    // noop
  }
}

export default AWS
