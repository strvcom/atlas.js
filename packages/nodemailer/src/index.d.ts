import * as nodemailer from 'nodemailer'
import AtlasService from '@atlas.js/service'

/**
 * Send emails using nodemailer from within Atlas
 */
declare class Service extends AtlasService {
  /** Service runtime configuration values */
  config: Service.Config

  prepare(): Promise<nodemailer.Transporter>
  start(service: nodemailer.Transporter): Promise<nodemailer.Transporter>
  stop(service: nodemailer.Transporter): Promise<void>
}

declare namespace Service {
  /** Configuration schema available to this service */
  type Config = {
    /**
     * The transport to be used for sending emails
     *
     * Either provide the transport module itself or specify it as a string and it will be
     * `require()`d.
     */
    transport: Function | string
    /**
     * Transport-specific options
     *
     * Check the docs for the transporter you are going to use for available options.
     */
    options: object

    plugins?: Array<PluginConfig>
  }

  type PluginConfig = {
    /**
     * The plugin to be added to the transporter
     *
     * Either provide the plugin module itself or specify it as a string and it will be
     * `require()`d.
     */
    plugin: Function | string
    /** Event to which this plugin should be attached */
    event: 'compile' | 'stream'
    /** Plugin configuration options */
    options: object
  }
}

export {
  Service,
  nodemailer,
}
