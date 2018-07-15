import Service from '@atlas.js/service'
import * as Admin from 'firebase-admin'

class Firebase extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    default: {},
    properties: {
      name: { type: 'string' },
      databaseURL: { type: 'string' },
      credential: {
        oneOf: [
          { type: 'string' },
          { type: 'object' },
        ],
      },
    },
  }

  prepare() {
    const config = this.config
    // Either load the credentials from the file (if it's a string) or just pass it as is (object?)
    const credential = typeof config.credential === 'string'
      ? this.atlas.require(config.credential)
      : config.credential

    return Admin.initializeApp({
      credential: Admin.credential.cert(credential),
      databaseURL: config.databaseURL,
    }, config.name)
  }

  async stop(firebase) {
    await firebase.delete()
  }
}

export default Firebase
