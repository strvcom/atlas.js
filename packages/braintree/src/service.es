import braintree from 'braintree'
import Service from '@atlas.js/service'

class Braintree extends Service {
  static defaults = {}

  prepare() {
    return braintree.connect(this.config)
  }
}

export default Braintree
