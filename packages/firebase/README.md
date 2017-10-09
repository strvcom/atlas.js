# @atlas.js/firebase

A Firebase-admin service for @atlas.js.

## Installation

`npm i @atlas.js/firebase`

## Usage

```js
import { Atlas } from '@atlas.js/atlas'
import * as Firebase from '@atlas.js/firebase'

const atlas = new Atlas({
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
atlas.service('firebase', Firebase.Service)
await atlas.start()

// Your firebase app is now available here:
atlas.services.firebase

// ie.
const users = await atlas.services.firebase.database()
  .ref('/users')
  .once('value')
```

## License

See the [LICENSE](LICENSE) file for information.
