import nodemailer from 'nodemailer'
import Service from '@atlas.js/service'

class Nodemailer extends Service {
  static defaults = {
    transport: null,
    options: {},
    defaults: {},
    // For a single plugin:
    // {
    //   plugin: () => {},
    //   event: 'compile',
    //   options: {},
    // }
    plugins: [],
  }

  async prepare() {
    const instance = nodemailer.createTransport(
      await this.config.transport(this.config.options),
      this.config.defaults,
    )

    // Attach a child logger to the nodemailer transport
    instance.logger = this.log.child({ transport: instance.transporter.name })

    // Apply plugins
    for (const plugin of this.config.plugins || []) {
      instance.use(plugin.event, plugin.plugin(plugin.options))
    }

    // Attach a promisified version of the sendMail function
    instance.send = instance::send

    return instance
  }

  async stop(instance) {
    await instance.close()
  }
}

function send(...args) {
  return new Promise((resolve, reject) => {
    this.sendMail(...args, (err, info) => void (
      err
        ? reject(err)
        : resolve(info))
    )
  })
}

export default Nodemailer
