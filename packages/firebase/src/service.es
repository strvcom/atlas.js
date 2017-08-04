import path from 'path'
import Service from '@theframework/service'
import * as Admin from 'firebase-admin'

class Firebase extends Service {
  static defaults = {
    name: null,
    credential: {},
    databaseURL: null,
  }

  prepare() {
    const config = this.config
    // Either load the credentials from the file (if it's a string) or just pass it as is (object?)
    const credential = typeof config.credential === 'string'
      // eslint-disable-next-line global-require
      ? require(path.resolve(this.app.root, config.credential))
      : config.credential

    this.instance = Admin.initializeApp({
      credential: Admin.credential.cert(credential),
      databaseURL: config.databaseURL,
    }, config.name)

    return this.instance
  }

  async stop() {
    const instance = this.instance
    this.instance = null

    await instance.delete()
  }
}

export default Firebase
