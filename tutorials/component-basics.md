# Component basics

## What is a component?

A component is (usually) a class which implements some kind of functionality that can be used by the framework or by your own code. Currently there are 3 types of components plus the core `Atlas` class.

### Atlas

The `Atlas` class is the primary container holding and managing your services. It provides a very basic functionality which consists of:

- Gathering and distributing all of your configuration to all registered components
- Managing your components' lifecycle (starting/stopping services, running hooks etc.)

### [Service](writing-services.md)

A Service is a component which usually connects or interacts with an external service or other interface (like a database). The most common trait of all services is that they have state - ie. an open connection. The purpose of a `Service` component is to manage that state for you so that you don't have to (ie. connecting, reconnecting and disconnecting from a database).

### [Hook](writing-hooks.md)

A hook is basically an event listener which can react to various application lifecycle events (ie. when the application is about to start or just before stopping). A hook is a great way to perform custom actions when particular things happen within the `Atlas` container (ie. run database migrations when starting).

### [Action](writing-actions.md)

Actions are a group of stateless functions which receive some input and generate an output. Their use within Atlas.js is completely optional but they are a great place to put business-specific code. Their main benefit is that they are reusable - you could call an action either from a CLI utility or from a route handler - they do not depend on the surrounding context.

---

While each component serves a different purpose, they do share some similarities. Let's look what you can do inside a component.

## Inside a component

When implementing components, the following properties are available as soon as the class is constructed:

- `atlas`: The main `Atlas` instance - useful to get information about the `root` path, `env` selected or whether the instance is `started` or `prepared`.
- `config`: Your component's configuration options as supplied by the user, with your component's default values already applied.
- `log`: A [pino][pino-home] instance with some pre-defined keys set so that it's clear that the logs are coming from this component. You can pass this logger instance down to your sub-components, if you like.
- `component`: Use this function to obtain another component

## Examples

Let's say we are writing an action component... We have a basic class like this one:

```js
import { Action } from '@atlas.js/atlas'

class MyAction extends Action {
  doThing() {}
}
```

From the `doThing()` method, we can do various things!

### Inspect the Action's config

```js
console.log(this.config)
```

### Inspect the current environment

```js
console.log(this.atlas.env)
```

### Get the path to the application folder

```js
console.log(this.atlas.root)
```

### Log something to the console

```js
this.log.info({ data: true }, 'log entry with data')
```

### Get to some other component

```js
// This requires that the Action declares this component as a required dependency via a
// static requires = ['service:server'] property. See the first-steps.md document for more info.
const server = this.component('service:server')
```

[pino-home]: https://www.npmjs.com/package/pino
