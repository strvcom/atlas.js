import * as braintree from 'braintree'
import Service from '@atlas.js/service'

class Braintree extends Service {
  static config = {
    type: 'object',
    additionalProperties: false,
    required: ['merchantId', 'publicKey', 'privateKey'],
    properties: {
      environment: { type: 'object' },
      merchantId: { type: 'string' },
      publicKey: { type: 'string' },
      privateKey: { type: 'string' },
    },
  }

  prepare() {
    return braintree.connect(this.config)
  }
}

export default Braintree
