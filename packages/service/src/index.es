import Component from '@theframework/component'

/**
 * Base service class all other services should inherit from
 */
class Service extends Component {
  prepare() {}
  start() {}
  stop() {}
}

export default Service
