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
        withAuthorization: true,
      }
    }
  },
  root: __dirname,
  env: 'dev',
})

app.service('rapid', RapidIO.Service)
app.start().then(() => {
  console.log(app.services.rapid)
  // Your rapid app is now available here:
  const todosList = app.services.rapid.collection('my-todo-list')
  todosList.newDocument().mutate({
    title: 'Something I need to do',
    completed: false,
    assignee: {
      name: 'John',
      nick: '@john123'
    }
  }).then(() => {
    console.log('success')
  }, err => {
    console.log(err)
  })

})
```

## License

See the [LICENSE](LICENSE) file for information.
