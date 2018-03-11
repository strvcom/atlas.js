import { FrameworkError } from '@atlas.js/errors'
import { ComponentContainer } from '.'

/**
 * Register a component into the given catalog
 *
 * @private
 * @param     {Object}    info              Component information
 * @param     {String}    info.type         The component's type (service, hook, action)
 * @param     {String}    info.alias        The component's user-specified name/alias
 * @param     {Class}     info.Component    The component class
 * @param     {Object}    info.aliases      Binding information to other defined components
 * @param     {Map}       catalog           The catalog to which to save the component
 * @return    {ComponentContainer}
 */
function component(info, catalog) {
  // Safety checks first
  if (catalog.has(info.alias)) {
    throw new FrameworkError(`Component with alias ${info.alias} (${info.type}) already used`)
  }

  // Pull user-provided config for this component
  // Use a plural form of the component type, ie., action -> actions, service -> services etc.
  info.config = this.config[`${info.type}s`][info.alias]

  const container = new ComponentContainer(info, this)

  catalog.set(info.alias, container)
  this.log.trace({ [info.type]: info.alias }, `${info.type}:add`)

  return container
}

export default component
