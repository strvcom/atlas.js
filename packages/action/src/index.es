import Component from '@theframework/component'

class Action extends Component {
  static type = 'action'

  constructor(options = {}) {
    super(options)

    this.config = options.config
  }
}

export default Action
