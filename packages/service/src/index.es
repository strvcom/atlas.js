import Component from '@theframework/component'

class Service extends Component {
  prepare(options = {}) {
    this.config = options.config
  }

  start() {}
  stop() {}
}

export default Service
