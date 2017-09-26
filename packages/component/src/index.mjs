class Component {
  static defaults = {}
  static requires = []

  app = null
  log = null
  config = {}

  constructor(options = {}) {
    this.app = options.app
    this.log = options.log
    this.config = options.config || {}
    this.component = options.resolve
  }
}

export default Component
