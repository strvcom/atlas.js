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
  const serialisers = typeof config.serializers === 'string'
    ? this.require(config.serializers, { normalise: true })
    : config.serializers

  config.serializers = {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
    ...serialisers,
  }

  return pino(config)
}

export default mklog
