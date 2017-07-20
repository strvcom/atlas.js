class Hook {
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
}

export default Hook
