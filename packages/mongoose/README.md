# @atlas.js/mongoose

Mongoose service for @atlas.js.

## Installation

`npm i @atlas.js/mongoose`

## Usage

### Service

The service configuration only accepts two properties: `uri` and `options` which are passed directly to the [`mongoose.connect(uri, options)`][mongoose-connect] method.

```js
import * as mongoose from '@atlas.js/mongoose'
import { Atlas } from '@atlas.js/atlas'

const atlas = new Atlas({
  config: {
    services: {
      database: {
        uri: 'mongodb://127.0.0.1:27017/my-db',
        options: {},
      }
    }
  }
})

atlas.service('database', mongoose.Service)
await atlas.start()

// You have your mongoose client available here:
atlas.services.database
```

#### Accessing the Atlas instance

When you add your `Schema` definitions to the service they get access to the Atlas instance as both a static property on the model and as an instance property on all instances of those models.

```js
const User = new Schema({
  /* your schema definitions go here */
})

User.statics = {
  doThisThing() {
    // this refers to User, in other words, this === mongoose.model('user')
    this.atlas
  }
}

User.methods = {
  doThatThing() {
    // this refers to an instance of User, in other words:
    // this instanceof mongoose.model('user') -> true
    this.atlas
  }
}

// From elsewhere in your codebase...
const User = atlas.services.database.model('user')
User.toThisThing()
const user = new User()
user.doThatThing()
```

### ModelsHook

#### Dependencies

- `service:mongoose`: A mongoose service to load the models into

You can use this hook to load your mongoose model definitions from a particular module location.

```js
// models/user.js

// You can import the necessary classes and definitions directly from the
// @atlas.js/mongoose module instead of loading the mongoose lib
import { Schema, SchemaTypes } from '@atlas.js/mongoose'

const User = new Schema({
  name: SchemaTypes.String,
  email: SchemaTypes.String,
})

export default User


// models/index.js
import User from './user'
export {
  User
}

// index.js
import * as mongoose from '@atlas.js/mongoose'
import { Atlas } from '@atlas.js/atlas'

const atlas = new Atlas({
  root: __dirname,
  config: {
    hooks: {
      models: {
        // The path to the module from which all the database models should be
        // loaded, relative to atlas.root
        module: 'models'
      }
    }
  }
})

atlas.service('database', mongoose.Service)
atlas.hook('models', mongoose.ModelsHook, {
  aliases: {
    'service:mongoose': 'database',
  }
})
await atlas.start()

// Now your models from the models/index.js module are loaded up!
const User = atlas.services.database.model('User')
```

## License

See the [LICENSE](LICENSE) file for information.

[mongoose-connect]: http://mongoosejs.com/docs/api.html#index_Mongoose-connect
