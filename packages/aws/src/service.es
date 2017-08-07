import Service from '@theframework/service'
import { defaultsDeep as defaults } from 'lodash'

class AWS extends Service {
  static defaults = {
    globals: {
      accessKeyId: null,
      secretAccessKey: null,
      region: null,
    },
    services: {},
  }

  prepare() {
    this.instance = {}

    for (const [service, config] of Object.entries(this.config.services)) {
      defaults(config, this.config.globals)

      // For best performance and memory utilisation, only load the services from the SDK which are
      // actually needed. This is the official recommended way of loading specific services.
      // eslint-disable-next-line global-require
      const AWSService = require(`aws-sdk/clients/${service.toLowerCase()}`)

      this.instance[service] = new AWSService(config)
    }

    return this.instance
  }

  stop() {
    this.instance = null
  }
}

export default AWS
