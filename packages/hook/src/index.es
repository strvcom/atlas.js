class Hook {
  static defaults = {}

  app = null
  log = null

  constructor(options = {}) {
    this.app = options.app
    this.log = options.log
  }

  async prepare() {}
}

export default Hook
