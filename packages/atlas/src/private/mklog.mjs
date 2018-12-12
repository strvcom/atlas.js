import * as pino from 'pino'

/**
 * Create a new instance of logger (pino)
 *
 * @private
 * @param     {Object}    config    Logger configuration
 * @return    {Object}
 */
function mklog(config) {
  // Allow loading the serialisers from a module
  config.serializers = typeof config.serializers === 'string'
    ? this.require(config.serializers, { normalise: true })
    : config.serializers

  return pino(config)
}

export default mklog
