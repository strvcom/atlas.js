# @atlas.js/sequelize

Sequelize service for @atlas.js.

## Installation

`npm i @atlas.js/sequelize`

You will also need to install one of the [supported database drivers][sequelize-db-drivers] on your own.

## Usage

### Service

The service configuration only accepts two properties: `uri` and `options` which are passed directly to the [`new Sequelize(uri, options)`][sequelize-constructor] constructor.

```js
import * as sequelize from '@atlas.js/sequelize'
import { Atlas } from '@atlas.js/atlas'

const atlas = new Atlas({
  config: {
    services: {
      database: {
        uri: 'postgres://postgres:postgres@127.0.0.1:27017/my-db',
        options: {
          pool: {
            max: 5,
            min: 2,
          }
        },
      }
    }
  }
})

atlas.service('database', sequelize.Service)
await atlas.start()

// You have your sequelize client available here:
atlas.services.database
```

Note that by default, the service does not load your models which means you will either have to load them up yourself or use the `ModelsHook` documented below.

### ModelsHook

This hook allows you to import your Sequelize models from a particular module location into the sequelize service.

#### ModelsHook Dependencies

- `service:sequelize`: A sequelize service to load the models into

```js
// models/user.js

// You can import the necessary classes and definitions directly from the
// @atlas.js/sequelize module instead of loading the whole sequelize lib
import { Model, DataTypes } from '@atlas.js/sequelize'

class User extends Model {
  // Here you can describe your model's fields (columns/attributes)
  // This goes directly to Model.init() as first argument
  static fields = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    someDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }

  // Here you can specify your model's config (options)
  // This goes directly to Model.init() as second argument
  static config = {
    paranoid: true,
    timestamps: true,
  }

  static staticMethod() {
    // You can access the Atlas instance as a property on the
    // Model class:
    // this refers to the model class itself
    this.atlas
  }

  async instanceMethod() {
    // On instance methods, you can also access the Atlas instance
    // directly on the model's instance
    // this refers to the model class' instance
    this.atlas
  }
}

export default User


// models/index.js
import User from './user'
// Do not use `export default` - instead export each model as a named export
// Alternatively, just assign each model to `module.exports` object.
export {
  User
}
// or
module.exports = {
  User,
}

// index.js
import * as sequelize from '@atlas.js/sequelize'
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

atlas.service('database', sequelize.Service)
atlas.hook('models', sequelize.ModelsHook, {
  aliases: {
    'service:sequelize': 'database',
  }
})
await atlas.start()

// Now your models from the models/index.js module are loaded up!
const User = atlas.services.database.model('User')
// or
const User = atlas.services.database.models.User
```

### RelationsHook

This hook allows you to describe your model's associations (relations) directly on the model definition, making the model's definition even more descriptive.

#### Dependencies

- `service:sequelize`: A sequelize service with all the models already loaded up

```js
class User extends Model {
  // Here you can define your model's relations (associations) to other models
  // in your app
  static relations = {
    // This will set up a "has many" relation from this model to the models
    // defined in the object
    hasMany: {
      // Let's say you have a Purchase model defined in your app - this will cause the following relation to be set up for you:
      // User.hasMany(Purchase, { as: 'purchase' })
      Purchase: {
        as: 'purchase',
      },
      // The key must match an existing model name
      Company: {}
    },
    belongsTo: {},
    hasOne: {},
  }
}
```

### Why fields, relations, config...?

> Why not attributes, associations and options?

Because all those properties already exist on a standard sequelize Model object, and adding them in your own model definition would overwrite them, causing all kinds of issues. Therefore new names had to be chosen.

### MigrationAction

This action contains methods for applying and rolling back your sequelize migrations. The migration files are written exactly like standard Sequelize migrations. In addition to using plain JavaScript migration files, you may also organise your migrations into a folder with an _index.js_ file inside, if the migration requires more data or you simply wish to organise the migration in a different way than a single script.

#### MigrationAction Dependencies

- `service:sequelize`: A sequelize service to use with which to apply/undo the migrations

```js
// index.js
import * as sequelize from '@atlas.js/sequelize'
import { Atlas } from '@atlas.js/atlas'

const atlas = new Atlas({
  root: __dirname,
  config: {
    actions: {
      migration: {
        // The path to the module from which all the migrations should be
        // loaded, relative to atlas.root
        module: 'migrations'
      }
    }
  }
})

atlas.action('migration', sequelize.MigrationAction, {
  aliases: {
    'service:sequelize': 'database'
  }
})
await atlas.start()

// Available actions:
await atlas.actions.migration.up() // Applies all pending migrations
await atlas.actions.migration.down() // Rolls back last applied migration
await atlas.actions.migration.pending() // Returns names of pending migrations
```

#### Running migrations on start

Migrations are not applied automatically on application start. You will need to implement your own hook which implements the `beforeStart` event handler and run the `up()` method from there.

A simple hook doing just that:

```js
import Hook from '@atlas.js/hook'

export default MigrateHook extends Hook {
  async beforeStart() {
    await this.atlas.actions.migrate.up()
  }
}
```

## License

See the [LICENSE](LICENSE) file for information.

[sequelize-db-drivers]: http://docs.sequelizejs.com/manual/installation/getting-started.html#installation
[sequelize-constructor]: http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
