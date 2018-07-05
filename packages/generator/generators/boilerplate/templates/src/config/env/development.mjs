/**
 * env-specific configuration overrides (development)
 *
 * This configuration is applied on top of the main configuration when NODE_ENV is 'development' or
 * when you start Atlas.js with the `env` constructor option set to 'development'.
 */
export default {
  atlas: {
    // Atlas uses pino as logger. See the project's README for possible options:
    // https://github.com/pinojs/pino
    log: {
      // Log levels are described here: https://github.com/pinojs/pino/blob/master/docs/API.md
      level: 'debug',
      prettyPrint: true,
    },
  },

  actions: {},
  services: {},
  hooks: {},
  aliases: {},
}
