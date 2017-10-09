# @atlas.js/braintree

Braintree client as a component for @atlas.js.

## Installation

`npm i @atlas.js/braintree`

## Usage

In addition to the Atlas.js Service, you can access all the objects and properties the standard braintree library exposes directly through this module, so you don't need to import the braintree library itself.

```js
import * as braintree from '@atlas.js/braintree'
import { Atlas } from '@atlas.js/atlas'

const app = new Atlas({
  config: {
    services: {
      payments: {
        environment: braintree.Environment.Development,
        publicKey: 'your-public-key',
        privateKey: 'your-private-key',
        merchantId: 'your-merchant-id',
      }
    }
  }
})

app.service('payments', braintree.Service)
await app.start()

// The braintree service is now available here:
app.services.payments
// Example use
await app.services.payments.transaction.sale({
  amount: '5.00',
  paymentMethodNonce: 'nonce-from-the-client',
})
```

## License

See the [LICENSE](LICENSE) file for information.
