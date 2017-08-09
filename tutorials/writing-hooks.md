# Writing hooks

## What is a hook?

A hook is a class which implements event handlers. These event handlers can be called by the framework at specific moments in the application's lifecycle. A hook is a great way to execute code when something important happens to your application.

Some common traits of a hook:

- They usually interact with other components of your application (like services or actions)
- They need to be called when ie. the application is about to start or when the app is shutting down (stopping)
- The logic they implement is not executed during normal operation (ie. when the app is already running)

## Structure of a hook

A hook may implement some or all event handlers currently supported by the framework. The following events are currently supported:

The following events are currently supported:

- **`application:prepare:after`** - Use this event to modify or otherwise enhance your components with extra functionality
- **`application:start:before`** - Use this event to further configure your services with custom middleware, or register database models or perform other important tasks to prepare the service for handling requests.
- **`application:start:after`** - The application is ready for prime time at this moment and services which accept connections are accepting them now. Use this to ie. start workers or schedule jobs.
- **`application:stop:before`** - The application has been requested to be shut down (by calling `app.stop()`) - use this to stop workers or perform other important tasks. Note, however, that at this moment all services are still accepting requests, so do not shut down anything which could disrupt their normal operations!
- **`application:stop:after`** - All services have been stopped or disconnected and the components are no longer available - use this to save important information to disk or perform other important cleanup.

Here is a bare class which implements all currently supported event handlers.

> **NOTE**: A hook is not directly accessible from other components! The functionality each hook implements is called upon by the Application class. If you need to run the code in a hook multiple times or re-use it frequently, it is best to implement it as an Action.

```js
import Hook from '@atlas.js/hook'

class LifecycleLogger extends Hook {

  async 'application:prepare:after'() {
    this.log.info('done preparing!')
  }
  async 'application:start:before'() {
    this.log.info('about to start!')
  }
  async 'application:start:after'() {
    this.log.info('started, woohoo!')
  }
  async 'application:stop:before'() {
    this.log.info('about to stop')
  }
  async 'application:stop:after'() {
    this.log.info('see you later!')
  }
}

export default LifecycleLogger
```

## Using a hook

Once you have your hook class ready, it's time to add it to your app!

```js
import { Application } from '@atlas.js/core'
import LifecycleLogger from './lifecycle-logger'

const app = new Application({
  root: __dirname,
  env: process.env.NODE_ENV,
  hooks: {
    // Some hooks might accept configuration options - this is where you would put them!
    lifecycle: {}
  }
})

// Now add the component to the app! Remember to use the same name for the component
// as you used in your configuration!
app.hook('lifecycle', LifecycleLogger)
// Time to start the app!
app.start()
// You will notice a bunch of log entries appearing in your console!
```
