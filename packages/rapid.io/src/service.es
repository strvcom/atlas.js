import Service from '@atlas.js/service'
import rapid from 'rapid-io'

class Rapid extends Service {
  static defaults = {
    apiKey: '',
    authToken: '',
    withAuthorization: false,
  }

  prepare() {
    return rapid.createClient(this.config.apiKey)
  }

  async start(rapidClient) {
    if (this.config.withAuthorization) {
      return this.authorize(rapidClient)
    }

    await new Promise((resolve, reject) => {
      if (rapidClient.connected) {
        resolve()
      }

      rapidClient.onConnectionStateChanged(() => {
        if (rapidClient.connected) {
          resolve()
        } else {
          const err = new Error('Rapid client was unable to initialize a connection.')
          reject(err)
        }
      })
    })

    this.log.info('Rapid client successfully connected.')
  }

  stop(rapidClient) {
    rapidClient.disconnect()
    return new Promise(resolve => {
      if (!rapidClient.connected) {
        resolve()
      }

      rapidClient.onConnectionStateChanged(() => {
        if (!rapidClient.connected) {
          resolve()
        }
      })
    })
  }

  /**
   * Authorizes client's access rights to work with protected collections.
   * @param rapidClient
   * @return {Promise.<void>}
   */
  async authorize(rapidClient) {
    await new Promise((resolve, reject) => {
      rapidClient.authorize(this.config.authToken, err => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })

    this.log.info('Rapid client successfully connected and authorized.')
  }
}

export default Rapid
