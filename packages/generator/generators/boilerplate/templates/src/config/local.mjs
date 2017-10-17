/**
 * Local, per-developer configuration
 *
 * This file is ignored by git. Its purpose is to allow individual developers working on the same
 * project to provide their own configuration options that match their preference or development
 * tools. Usually this is done via `dotenv`, but sometimes you just need to override some setting
 * which is not managed via environment variables. That's where this file becomes useful.
 *
 * This file's structure is the same as the main configuration module.
 */
export default {
  atlas: {},
  actions: {},
  services: {},
  hooks: {},
  aliases: {},
}
