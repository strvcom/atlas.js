# Writing services

## What is a service?

A Service is a self-contained component which interacts with some kind of remote/foreign interface. A Database library is a component, an HTTP interface for a particular API may be considered a service. Even the file system may be considered a service, really, although writing a service for that would probably be useless.

## Structure of a service

A service must implement some functionality to work correctly within the framework. Here is a bare class which implements all of them, with documentation and examples.

> **NOTE**: This class is not what your users will interact with! It's just a state management layer so that the framework can properly interface with your actual service.

```js
import Service from '@theframework/service'
import request from 'request-promise'

class MyService extends Service {
  // Default configuration values that your service expects. If the user does
  // not provide a value for the option, the value defined here will be used.
  static defaults = {}
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
    this.instance = request.defaults({
      baseUrl: 'api.github.com',
      json: true
    })

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
    // If you need to access another service/action, you can use
    // `this.component()`:
    const http = this.component('service:http')
    // Do something funny with the `http` service.
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

export default MyService
```
