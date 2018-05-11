# Writing services

## What is a service?

A Service is a self-contained component which interacts with some kind of remote/foreign interface. A Database library is a component, an HTTP interface for a particular API may be considered a service. Even the file system may be considered a service, really, although writing a service for that would probably be useless.

Some common traits of a service:

- They are self-contained (they only need their own configuration to work)
- They do not interact with other components
- Other components (actions, hooks) interact with the service, instead
- They keep some kind of persistent connection open to some remote place (websockets, raw TCP etc.)

## Structure of a service

A service must implement some functionality to work correctly within the framework. Here is a bare class which implements all of them, with documentation and examples.

> **NOTE**: This class is not what your users will interact with! It's just a state management layer so that the framework can properly interface with your actual service.

```js
import Service from '@atlas.js/service'
import request from 'request-promise'

class GithubApi extends Service {
  // Declare your configuration schema for your component, using JSON Schema
  // Your actual config can be accessed from the component instance via `this.config`
  static config = {
    type: 'object',
    properties: {
      json: {
        type: 'boolean',
        default: true,
      },
    },
  }

  // If your service needs to interact with another service or action, you should declare
  // the name of the component under which you will expect it to find.
  // It is the user's responsibility to map the name you define here to an
  // actual component.
  static requires = [
    // ie. 'service:http'
  ]

  // In this method, you must initialise whatever should then be exposed as
  // the service interface. It can be an object, a function or even a
  // primitive value.
  async prepare() {
    // this.config contains your component's configuration. It contains any
    // options supplied by the user and your component's defaults defined
    // using the static config property as JSON schema.
    this.instance = request.defaults(this.config)

    // This is what your service's users will be able to access
    return this.instance
  }

  // In this method, you should create any necessary connections to external
  // services to serve requests. In this case, we do not need to do anything
  // special, but when writing a database service, this would be the place to
  // call *.connect() or similar method.
  async start() {
    // Connect to any remote server or do other I/O to be able to serve your
    // clients.
  }

  // The whole application is about to be stopped. Here you should gracefully
  // disconnect from any remote services, close any open handles, cancel
  // timeouts or perform any additional work so that the Node.js process can
  // exit cleanly.
  // This is the place where you would call *.disconnect(), *.close() or
  // similar method.
  async stop() {
    this.instance = null
  }
}

export default GithubApi
```

## Using a service

Once you have your service class ready, it's time to add it to your app!

```js
import { Atlas } from '@atlas.js/atlas'
import GithubApi from './github-api'

const atlas = new Atlas({
  root: __dirname,
  env: process.env.NODE_ENV,
  config: {
    services: {
      // The property name that you use here must match the component name that
      // you use when adding the component to the app, so in this case we will
      // use `githubapi`. Otherwise your configuration won't be delivered to
      // the component and it will use its defaults.
      githubapi: {
        baseUrl: 'https://api.github.com'
      }
    }
  }
})

// Now add the component to the app! Remember to use the same name for the component
// as you used in your configuration!
atlas.service('githubapi', GithubApi)

// Time to start the app!
atlas.start()
.then(async () => {
  // You can now access the interface you exposed in your component's
  // `prepare()` method this way:
  const githubapi = atlas.services.githubapi
  // Calls the github API and fetches the users (imaginary endpoint, don't use!)
  const res = await githubapi.get({ uri: '/v1/users' })
})
```
