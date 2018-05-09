# @atlas.js/objection

Object.js service for @atlas.js.

## Installation

`npm i @atlas.js/objection`

You will also need to install one of the [supported database drivers][knex-db-drivers] on your own.

## Usage

### Service

The service accepts three configuration options - `models`, `knex` and `prefetch`.

- `models`: A path to a module, relative to application's root, from which to load database models. Each exported key is expected to a model.
- `knex`: This object is [passed as-is][knex-config] to the underlying Knex client to initialise the connection.
- `prefetch`: (default `true`) Determines whether your models' table schemas will be eagerly prefetched on startup to avoid fetching them during actual requests. See [Objection.js docs][objection-fetchtableschema] to learn more about this behaviour.

```js
import * as objection from '@atlas.js/objection'
import { Atlas } from '@atlas.js/atlas'

const atlas = new Atlas({
  config: {
    services: {
      database: {
        prefetch: true,
        models: 'path/to/objection-models',
        knex: {
          client: 'mysql',
          connection: {
            host : '127.0.0.1',
            user : 'your_database_user',
            password : 'your_database_password',
            database : 'myapp_test'
          }
        },
      },
    },
  },
})

atlas.service('database', objection.Service)
await atlas.start()

// You have your objection client and all models available here:
atlas.services.database
// A knex instance
atlas.services.database.connection
// Object with all the models you defined, ready for use
atlas.services.database.models
```

### MigrationAction

This action contains methods for applying and rolling back your migrations. The migration files must export an `up()` and `down()` functions. Both of these functions should return a `Promise` and their first argument is the `knex` client.

In addition to using plain JavaScript migration files, you may also organise your migrations into a folder with an _index.js_ file inside, if the migration requires more data or you simply wish to organise the migration in a different way than a single script.

#### MigrationAction Dependencies

- `service:objection`: An Objection.js service to use with which to apply/undo the migrations

```js
// index.js
import * as objection from '@atlas.js/objection'
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

atlas.action('migration', objection.MigrationAction, {
  aliases: {
    'service:objection': 'database'
  }
})
await atlas.start()

// Available actions:
await atlas.actions.migration.up() // Applies all pending migrations
await atlas.actions.migration.down() // Rolls back last applied migration
await atlas.actions.migration.pending() // Returns names of pending migrations
```

#### Running migrations on start

Migrations are not applied automatically on application start. You will need to implement your own hook which implements the `afterStart` event handler and run the `up()` method from there.

A simple hook doing just that:

```js
import Hook from '@atlas.js/hook'

export default MigrateHook extends Hook {
  static observes = 'service:objection'

  async afterStart() {
    await this.atlas.actions.migrate.up()
  }
}
```

## License

See the [LICENSE](LICENSE) file for information.

[knex-db-drivers]: http://knexjs.org/#Installation-node
[knex-config]: http://knexjs.org/#Installation-client
[objection-fetchtableschema]: http://vincit.github.io/objection.js/#fetchtablemetadata
