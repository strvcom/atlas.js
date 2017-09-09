# atlas.js/objection

Objection.js service for @atlas.js framework.

## installation

`npm i @atlas.js/objection`

You will also need to install one of recommended database drivers e.g `pg`, `sqlite3`. Objection internally connects via `knex.js` so follow
[their docs](http://knexjs.org/) for details.

## Example

A complete example of Atlas.js app with koa and objection services can be found [here](https://github.com/behalka/atlas-sample-app)

## Usage

### Service

Service creates a knex connection and binds it to the `objection.js` object. Service accepts configuration in following format:

```js
database: {
  knex: {
    client: 'postgresql',
    connection: 'connection_uri',
    pool: {
      min: 1,
      max: 3,
    }
  }
}
```

Where database is the alias for objection service. `Knex` field is passed directly to the knex connection constructor.
By default, this only setups the database connection. If you want to load models, you need to use `ModelsHook`.

### Hooks

#### ModelsHook

This hook allows you to import and build models from a config file without any dependencies and builds associations between them. The config file uses the same naming as `objection` models but instead of providing `Model` classes in the `modelClass` or `relation` fields, you only provide the names as strings and the hook will build relations for you. In other words, you model files do not need any dependencies in them :)

The hook also provides a simple translation between snake-case database field names and camelCase model properties. Any fetched models will have camelCased properties. Please note that in relations definitions (basically everywhere in joins) fields and table names must stay in the snake_case form. These names are directly fed to the database. This is unfortunately how the `objection` library works - you are just closer to the actual database :)

##### Dependencies

- `service:objection`: the service you load models into

##### Example

###### Models

Two related models - `user` and `userType` (typical 1:n relation). For all currently supported models config, check out [models-example.es](models-example.es).

```js
// models/user.js

const user = {
  tableName: 'users',
  jsonSchema: {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
  relationMappings: {
    myType: {
      relation: 'BelongsToOneRelation',
      modelClass: 'userType',
      join: {
        from: 'users.user_type_id',
        to: 'user_types.id',
      },
    },
  },
}

export default user
```

```js
// models/userType.js

const userType = {
  tableName: 'user_types',
  jsonSchema: {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
  relationMappings: {
    users: {
      relation: 'HasManyRelation',
      modelClass: 'user',
      join: {
        from: 'user_types.id',
        to: 'users.user_type_id',
      },
    },
  },
}

export default userType
```

```js
// models/index.js

import user from './user.js'
import userType from './userType.js'

export {
  user,
  userType,
}
```

`Models` directory is provided to the hook as follows:

```js
// index.js

import * as objection from '@atlas.js/objection'
import { Application } from '@atlas.js/core'

const app = new Application({
  root: __dirname,
  config: {
    hooks: {
      models: {
        // The path to the module from which all the database models should be
        // loaded, relative to app.root
        module: 'models'
      }
    }
  }
})

app.service('database', objection.Service)
app.hook('models', objection.ModelsHook, {
  aliases: {
    'service:objection': 'database',
  }
})
await app.start()
```

If you use service with `ModelsHook`, your models could be found like this:

```js
const models = app.services.database.models
const users = await models.user
  .query()
```

Assuming aliases that are provided in the example.
