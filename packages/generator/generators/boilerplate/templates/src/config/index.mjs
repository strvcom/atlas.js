/**
 * Configuration module
 *
 * Atlas.js loads this file and expects it to find either
 * - a default export with all the configuration sections in it
 * - a named export for each configuration section
 *
 * Atlas.js will automatically merge the configuration data from the env/ directory so you don't
 * need to do that here.
 *
 * You can either put all the configuration options directly into this file or you can split them
 * into separate modules and re-export them here. It's up to you! 💪
 *
 * And remember: the key under which you export a particular component's configuration must be the
 * same as the alias you gave to that component.
 */
export default {
  atlas: {
    // Atlas uses pino as logger. See the project's README for possible options:
    // https://github.com/pinojs/pino
    // Log levels are described here: https://github.com/pinojs/pino/blob/master/docs/API.md
    log: {},
  },
  actions: {},
  services: {},
  hooks: {},
  aliases: {},
}
