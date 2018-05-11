# Writing hooks

## What is a hook?

A hook is a class which implements event handlers. These event handlers can be called by the framework at specific moments in the application's lifecycle or by other components. A hook is a great way to execute code when something important happens in your application.

Some common traits of a hook:

- They usually interact with other components of your application (like services or actions)
- They need to be called when ie. the application is about to start or when the app is shutting down (stopping)
- They react to important events happening inside your application while it is running (via custom events)

## Structure of a hook

A hook may implement some or all event handlers currently supported by the framework, or it may implement custom events which other components dispatch. The following events are currently supported on all services and on the Atlas instance itself:

The following events are currently supported:

- **`afterPrepare`** - Use this event to modify or otherwise enhance your components with extra functionality
- **`beforeStart`** - Use this event to further configure your services with custom middleware, or register database models or perform other important tasks to prepare the service for handling requests.
- **`afterStart`** - The application is ready for prime time at this moment and services which accept connections are accepting them now. Use this to ie. start workers or schedule jobs.
- **`beforeStop`** - The application has been requested to be shut down (by calling `atlas.stop()`) - use this to stop workers or perform other important tasks. Note, however, that at this moment all services are still accepting requests, so do not shut down anything which could disrupt their normal operations!
- **`afterStop`** - All services have been stopped or disconnected and the components are no longer available - use this to save important information to disk or perform other important cleanup.

Here is a bare class which implements all currently supported event handlers.

> **NOTE**: A hook is not directly accessible from other components! The functionality each hook implements is called upon by the Atlas class. If you feel like you need to run the code in a hook's event handler at will, it is best to implement it as an Action and have the hook simply call the action when appropriate.

```js
import { Hook } from '@atlas.js/atlas'

class LifecycleLogger extends Hook {
  // We must tell Atlas which component we want to observe. Here, we are
  // observing the Atlas instance itself, but you could also observe some
  // other action or service: static observes = 'action:user'
  static observes = 'atlas'

  // Declare your configuration schema for your component, using JSON Schema
  // Your actual config can be accessed from the component instance via `this.config`
  static config = {
    type: 'object',
    properties: {
      something: {
        type: 'string',
        default: 'important',
      },
    },
  }

  async afterPrepare() {
    this.log.info('done preparing!')
  }
  async beforeStart() {
    this.log.info('about to start!')
  }
  async afterStart() {
    this.log.info('started, woohoo!')
  }
  async beforeStop() {
    this.log.info('about to stop')
  }
  async afterStop() {
    this.log.info('see you later!')
  }
}

export default LifecycleLogger
```

## Using a hook

Once you have your hook class ready, it's time to add it to your app!

```js
import { Atlas } from '@atlas.js/atlas'
import LifecycleLogger from './lifecycle-logger'

const atlas = new Atlas({
  root: __dirname,
  env: process.env.NODE_ENV,
  hooks: {
    // Some hooks might accept configuration options - this is where you would put them!
    lifecycle: {}
  }
})

// Now add the component to the app! Remember to use the same name for the component
// as you used in your configuration!
atlas.hook('lifecycle', LifecycleLogger)
// Time to start the app!
atlas.start()
// You will notice a bunch of log entries appearing in your console!
```

## Handling custom events from other components

Some components might emit/dispatch other, non-standard events. To receive and handle them, all you have to do insisde a hook is to implement the event's name as a method. This method will then be invoked by Atlas when the component your Hook observes emits that event.

```js
class MyHook extends Hook {
  // This hook will only receive events from this component
  static observes = 'action:users'

  async userDidRegister(account) {
    // do something interesting with account, ie. send an email using our
    // imaginary email client
    await email.send({ to: account.email, subject: 'welcome!'})
  }
}
```

To trigger this event from another component, ie. from an action:

```js
class Users extends Action {
  async register(data) {
    // save the data somehow...
    const account = await db.insert(data)

    // This will call the userDidRegister method on all hooks which are
    // observing this component 💪
    this.dispatch('userDidRegister', account)

    return account
  }
}
```
