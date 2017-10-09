class Component {
  static defaults = {}
  static requires = []

  atlas = null
  log = null
  config = {}

  constructor(options = {}) {
    this.atlas = options.atlas
    this.log = options.log
    this.config = options.config || {}
    this.component = options.resolve
  }
}

export default Component
