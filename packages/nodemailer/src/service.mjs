import * as nodemailer from 'nodemailer'
import Service from '@atlas.js/service'

class Nodemailer extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    required: ['transport'],
    properties: {
      // Name of the module to load as a transport
      transport: { type: 'string' },
      // Options passed to the transport
      options: { type: 'object' },
      plugins: {
        type: 'array',
        default: [],
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['plugin', 'event'],
          properties: {
            plugin: { type: 'string' },
            event: { type: 'string', enum: ['compile', 'stream'] },
            options: { type: 'object' },
          },
        },
      },
    },
  }

  async prepare() {
    const transport = typeof this.config.transport === 'string'
      // eslint-disable-next-line global-require
      ? require(this.config.transport)
      : this.config.transport
    const instance = nodemailer.createTransport(
      await transport(this.config.options),
      this.config.defaults,
    )

    // Attach a child logger to the nodemailer transport
    instance.logger = this.log.child({ transport: instance.transporter.name })

    // Apply plugins
    for (const definition of this.config.plugins || []) {
      const plugin = typeof definition.plugin === 'string'
        // eslint-disable-next-line global-require
        ? require(definition.plugin)
        : definition.plugin
      instance.use(definition.event, plugin(definition.options))
    }

    // Attach a promisified version of the sendMail function
    instance.send = instance::send

    return Promise.resolve(instance)
  }

  async stop(instance) {
    // Only close the instance if the transporter supports it
    if (typeof instance.transporter.close !== 'function') {
      return
    }

    await instance.close()
  }
}

function send(...args) {
  return new Promise((resolve, reject) => {
    this.sendMail(...args, (err, info) => void (
      err ? reject(err) : resolve(info)))
  })
}

export default Nodemailer
