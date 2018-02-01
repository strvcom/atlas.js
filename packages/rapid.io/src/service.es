import Service from '@atlas.js/service'
import rapidio from 'rapid-io'

class Rapid extends Service {
  static defaults = {
    apiKey: '',
    authToken: '',
    withAuthorization: false,
  }

  prepare() {
    return rapidio.createClient(this.config.apiKey)
  }

  async start(instance) {
    if (this.config.withAuthorization) {
      await this.authorize(instance)
      return instance
    }

    await new Promise((resolve, reject) => {
      if (instance.connected) {
        resolve()
      }

      instance.onConnectionStateChanged(() => {
        if (instance.connected) {
          resolve()
        } else {
          const err = new Error('Rapid instance was unable to initialize a connection.')
          reject(err)
        }
      })
    })

    this.log.info('Rapid instance successfully connected.')
    return instance
  }

  stop(instance) {
    instance.disconnect()
    return new Promise(resolve => {
      if (!instance.connected) {
        resolve()
      }

      instance.onConnectionStateChanged(() => {
        if (!instance.connected) {
          resolve()
        }
      })
    })
  }

  /**
   * Authorizes instance's access rights to work with protected collections.
   * @param {Object} instance Rapid instance to be authorized
   * @return {Promise.<void>}
   */
  async authorize(instance) {
    await new Promise((resolve, reject) => {
      instance.authorize(this.config.authToken, err => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })

    this.log.info('Rapid instance successfully connected and authorized.')
  }
}

export default Rapid
