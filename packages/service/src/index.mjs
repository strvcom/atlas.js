import Component from '@atlas.js/component'

/**
 * Base service class which all Atlas services should subclass
 *
 * This class provides basic functionality to integrate a Service into Atlas. Atlas expects all
 * Services to have a certain interface, therefore when you want to create your own service, you
 * should subclass this base Service class.
 *
 * @abstract
 */
class Service extends Component {
  static type = 'service'

  prepare() { return Promise.resolve() }
  start() { return Promise.resolve() }
  stop() { return Promise.resolve() }
}

export default Service
