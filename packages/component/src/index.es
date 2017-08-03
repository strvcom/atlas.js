class Component {
  static defaults = {}

  app = null
  log = null
  config = {}

  constructor(options = {}) {
    this.app = options.app
    this.log = options.log
    this.config = options.config || {}
  }
}

export default Component
