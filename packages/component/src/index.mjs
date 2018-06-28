class Component {
  static internal = false
  static config = {}

  // @DEPRECATED: Use static config as JSON Schema
  static defaults = {}
  static requires = []

  atlas = null
  log = null
  config = {}

  constructor(options = {}) {
    this.atlas = options.atlas
    this.log = options.log
    this.config = options.config || {}
    this.component = options.component
    this.dispatch = options.dispatch
  }
}

export default Component
