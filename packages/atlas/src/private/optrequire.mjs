/**
 * Optionally require a module, returning an empty object if the module cannot be required
 *
 * @private
 * @param     {String}    module    Path to the module to require
 * @return    {mixed}               The module's contents
 */
function optrequire(module) {
  try {
    // eslint-disable-next-line global-require
    return require(module)
  } catch (err) {
    return {}
  }
}

export default optrequire
