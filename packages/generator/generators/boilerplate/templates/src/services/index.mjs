/**
 * Atlas.js service catalog
 *
 * To add a service to Atlas.js, import the component here and export it under an alias you wish to
 * use. The component will then be available at `atlas.services[alias]`.
 * ie.
 *
 * ```js
 * import { Service as database } from '@atlas.js/sequelize'
 * export {
 *   database,
 * }
 * ```
 */

import { Service as noop } from '@app/noop'

// ES Modules' named exports are sorted alphabetically when iterated but we want to control the
// order of the services here, that's why we are using a default export, instead. ⚠️
export default {
  noop,
}
