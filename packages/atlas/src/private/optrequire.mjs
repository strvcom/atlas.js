/**
 * Optionally require a module, returning an empty object if the module does not exist
 *
 * @private
 * @param     {String}    location  Path to the module to require
 * @return    {mixed}               The module's contents
 */
function optrequire(location) {
  try {
    require.resolve(location)
  } catch (err) {
    return {}
  }

  // eslint-disable-next-line global-require
  return require(location)
}

export default optrequire
