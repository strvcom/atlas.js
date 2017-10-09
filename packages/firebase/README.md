# @atlas.js/firebase

A Firebase-admin service for @atlas.js.

## Installation

`npm i @atlas.js/firebase`

## Usage

```js
import { Atlas } from '@atlas.js/atlas'
import * as Firebase from '@atlas.js/firebase'

const app = new Atlas({
  config: {
    services: {
      firebase: {
        name: 'my-fb-dev',
        // The path, relative to `root`, to the Firebase's credential JSON file
        // you got from the Admin UI
        credential: 'path/to/credential.json',
        // Alternatively, this can be an object which goes directly to
        // `Admin.credential.cert()`:
        credential: {},
        // Your Firebase database URL
        databaseURL: 'my-fb-dev.firebaseio.com',
      }
    }
  }
})
app.service('firebase', Firebase.Service)
await app.start()

// Your firebase app is now available here:
app.services.firebase

// ie.
const users = await app.services.firebase.database()
  .ref('/users')
  .once('value')
```

## License

See the [LICENSE](LICENSE) file for information.
