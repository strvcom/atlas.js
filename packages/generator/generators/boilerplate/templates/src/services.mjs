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

export {
  noop,
}
