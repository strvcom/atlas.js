/**
 * Optionally require a module, returning an empty object if the module does not exist
 *
 * @private
 * @param     {String}    module    Path to the module to require
 * @return    {mixed}               The module's contents
 */
function optrequire(module) {
  try {
    require.resolve(module)
  } catch (err) {
    return {}
  }

  // eslint-disable-next-line global-require
  return require(module)
}

export default optrequire
