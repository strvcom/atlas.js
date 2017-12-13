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
    // @CHANGED: The `resolve` param is deprecated, use `component`
    this.component = options.component || options.resolve
  }
}

export default Component
