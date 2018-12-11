import Hook from '@atlas.js/hook'

class ModelsHook extends Hook {
  static config = {
    type: 'object',
    additionalProperties: false,
    default: {},
    required: ['module'],
    properties: {
      module: {
        type: 'string',
        default: 'models',
      },
    },
  }

  static observes = 'service:sequelize'
  static requires = [
    'service:sequelize',
  ]

  afterPrepare() {
    const sequelize = this.component('service:sequelize')
    const models = this.atlas.require(this.config.module)

    for (const [name, Model] of Object.entries(models)) {
      const config = {
        // This option is required in order for the initialisation to work
        sequelize,
        ...Model.config,
      }

      Model.init(Model.fields, config)
      // Expose Atlas to the models
      Model.atlas = this.atlas
      Model.prototype.atlas = this.atlas

      this.log.debug({ model: name }, 'sequelize model')
    }
  }
}

export default ModelsHook
