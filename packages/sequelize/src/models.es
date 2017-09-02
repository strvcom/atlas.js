import path from 'path'
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

    // Load all models
    // eslint-disable-next-line global-require
    const models = require(path.resolve(this.app.root, this.config.module))

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
