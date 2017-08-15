import path from 'path'
import Hook from '@atlas.js/hook'

class ModelsHook extends Hook {
  static defaults = {
    module: 'models',
  }

  static requires = [
    'service:mongoose',
  ]

  'application:prepare:after'() {
    const instance = this.component('service:mongoose')

    // Load all schemas
    // eslint-disable-next-line global-require
    const schemas = require(path.resolve(this.app.root, this.config.module))

    for (const name of Object.keys(schemas)) {
      instance.model(name, schemas[name])
      this.log.debug({ model: name }, 'mongoose model')
    }
  }
}

export default ModelsHook
