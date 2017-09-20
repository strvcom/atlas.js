import moment from 'moment-timezone'
import { mapKeys, snakeCase, camelCase } from 'lodash'

/**
 * @param {object} Model objection.js Model class
 * @returns {class}
 */
function CamelCaseTransformMixin(Model) {
  return class extends Model {
    // camelCase <-> snake_case hook
    $parseDatabaseJson(json) {
      json = mapKeys(json, (value, key) => camelCase(key))
      return super.$parseDatabaseJson(json)
    }
    $formatDatabaseJson(json) {
      json = super.$formatDatabaseJson(json)
      return mapKeys(json, (value, key) => snakeCase(key))
    }
  }
}

/**
 * @param {object} options config object
 * @param {boolean} options.timestamps - if set to true, updatedAt and createdAt
 *  timestamps will be automatically set and updated
 * @returns {function} returns the actual mixin function
 */
function makeTimestampsMixin(options = { timestamps: false }) {
  return Model =>
    class extends Model {
      $beforeInsert() {
        if (options.timestamps === true) {
          this.createdAt = moment().format()
          this.updatedAt = moment().format()
        }
      }
      $beforeUpdate() {
        if (options.timestamps === true) {
          this.updatedAt = moment().format()
        }
      }
    }
}

export {
  makeTimestampsMixin,
  CamelCaseTransformMixin,
}
