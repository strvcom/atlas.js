/**
 * env-specific configuration overrides (test)
 *
 * This configuration is applied on top of the main configuration when NODE_ENV is 'test' or
 * when you start Atlas.js with the `env` constructor option set to 'test'.
 */
export default {
  atlas: {
    log: {
      level: 'error',
    },
  },

  actions: {},
  services: {},
  hooks: {},
  aliases: {},
}
