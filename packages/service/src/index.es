class Service {
  static defaults = {}

  app = null
  log = null

  constructor(options = {}) {
    this.app = options.app
    this.log = options.log
  }

  prepare(options = {}) {
    this.config = options.config
  }

  start() {}
  stop() {}
}

export default Service
