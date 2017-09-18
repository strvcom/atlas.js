# @atlas.js/rapid.io

A Rapid.io service for @atlas.js.

## Installation

`npm i @atlas.js/rapid.io`

## Usage

```js
import { Application } from '@atlas.js/core'
import * as RapidIO from '@atlas.js/rapid.io'

const app = new Application({
  config: {
    services: {
      rapid: {
        apiKey: 'rapidApiKey',
        authToken: 'rapidSecret',
        // optional, will authorize protected collections with authToken
        withAuthorization: true,
      }
    }
  },
  root: __dirname,
  env: 'dev',
})

app.service('rapid', RapidIO.Service)
app.start().then(() => {
  
  // Your rapid.io service is now available here:
  app.services.rapid
  
  // example usage:
  const todosList = app.services.rapid.collection('my-todo-list')
  const todo = await todosList.newDocument().mutate({
    title: 'Don't forget to write documentation!',
    completed: false,
    assignee: {
      name: 'John',
      email: 'john@example.com'
    }
  })

})
```

## License

See the [LICENSE](LICENSE) file for information.
