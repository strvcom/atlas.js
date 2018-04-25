import Component from '@atlas.js/component'

/**
 * Base service class all other services should inherit from
 */
class Service extends Component {
  static type = 'service'

  prepare() { return Promise.resolve() }
  start() { return Promise.resolve() }
  stop() { return Promise.resolve() }
}

export default Service
