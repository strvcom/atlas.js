import Component from '@theframework/component'

class Hook extends Component {
  prepare(options = {}) {
    this.config = options.config
  }
}

export default Hook
