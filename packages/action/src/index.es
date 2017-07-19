class Action {
  static defaults = {}

  app = null
  log = null

  constructor(options = {}) {
    this.app = options.app
    this.log = options.log
    this.config = options.config
  }
}

export default Action
