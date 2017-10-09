import Hook from '@atlas.js/hook'

class ModelsHook extends Hook {
  static defaults = {
    module: 'models',
  }

  static requires = [
    'service:sequelize',
  ]

  'application:prepare:after'() {
    const sequelize = this.component('service:sequelize')
    const models = this.atlas.require(this.config.module)

    for (const [name, Model] of Object.entries(models)) {
      const config = {
        // This option is required in order for the initialisation to work
        sequelize,
        ...Model.config,
      }

      Model.init(Model.fields, config)
      this.log.debug({ model: name }, 'sequelize model')
    }
  }
}

export default ModelsHook
