# @atlas.js/nodemailer

A nodemailer-based mailing service for @atlas.js.

## Installation

`npm i @atlas.js/nodemailer`

## Usage

```js
import { Atlas } from '@atlas.js/atlas'
import * as Nodemailer from '@atlas.js/nodemailer'

const app = new Atlas({
  config: {
    services: {
      email: {
        // The transport module to be used
        transport: require('nodemailer-ses-transport'),
        // Alternatively, just pass the module's name
        transport: 'nodemailer-ses-transport',
        // These options are passed to the transport module unmodified, so go
        // read the transport's docs as to what you can set here!
        options: {},
        // An array of plugins to add to nodemailer
        plugins: [{
          // Nodemailer's event to which the plugin should be added
          event: 'compile',
          // The plugin module to use
          plugin: require('nodemailer-html-to-text'),
          // Alternatively, just pass the module's name
          plugin: 'nodemailer-html-to-text',
          // These options are passed directly to the plugin function
          options: {},
        }]
      }
    }
  }
})
app.service('email', Nodemailer.Service)
await app.start()

// The email service is now available here:
app.services.email
```

In addition to having the standard, callback-based `sendMail()` function available, you can use a custom async `send()` method:

```js
await app.services.email.send({ to: 'test@example.com' })
```

## License

See the [LICENSE](LICENSE) file for information.
