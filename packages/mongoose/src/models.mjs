import Hook from '@atlas.js/hook'

class ModelsHook extends Hook {
  static config = {
    type: 'object',
    additionalProperties: false,
    properties: {
      module: {
        type: 'string',
        default: 'models',
      },
    },
  }

  static observes = 'service:mongoose'
  static requires = [
    'service:mongoose',
  ]

  afterPrepare() {
    const instance = this.component('service:mongoose')
    const schemas = this.atlas.require(this.config.module)

    for (const name of Object.keys(schemas)) {
      instance.model(name, schemas[name])
      this.log.debug({ model: name }, 'mongoose model')
    }
  }
}

export default ModelsHook
