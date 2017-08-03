import Component from '@theframework/component'

class Action extends Component {
  constructor(options = {}) {
    super(options)

    this.config = options.config
  }
}

export default Action
