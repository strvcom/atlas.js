import Hook from '@atlas.js/hook'
import { FrameworkError } from '@atlas.js/errors'

class AssociationsHook extends Hook {
  static requires = [
    'service:sequelize',
  ]

  afterPrepare() {
    const { models } = this.component('service:sequelize')
    // Go through all the registered models and execute the relations per type (hasOne, hasMany,
    // belongsTo etc.)
    for (const [name, Model] of Object.entries(models)) {
      // Each type of relation can associate to multiple models. Iterate on the definition and
      // run the relation for each of the target models
      for (const [type, relations] of Object.entries(Model.relations || {})) {
        // If the type of the relation does not have a respective function on the source model
        // it is not a valid relation!
        if (typeof Model[type] !== 'function') {
          throw new FrameworkError(`Invalid relation type: ${type} in model ${name}`)
        }

        // Finally go through all the target models and run the relation for each of them
        // This will result in calls like
        // Model.hasMany(Target, options)
        for (const [target, options] of Object.entries(relations)) {
          const Target = models[target]

          if (!Target) {
            throw new FrameworkError(`Invalid relation target: ${target} for model ${name}`)
          }

          Model[type](Target, options)

          this.log.debug({
            source: name,
            type,
            target,
          }, 'sequelize relation')
        }
      }
    }
  }
}

export default AssociationsHook
