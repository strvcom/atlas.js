class Service {
  static defaults = {}

  app = null
  log = null

  constructor(options = {}) {
    this.app = options.app
    this.log = options.log
  }

  async prepare() {}
  async start() {}
  async stop() {}
}

export default Service
