[travis-badge]: https://travis-ci.com/strvcom/framework.svg?token=vpBhQ7GACx5Nze8Y9Ju6
[travis-url]: https://travis-ci.com/strvcom/framework
[make-badge]: https://img.shields.io/badge/Built%20with-GNU%20Make-brightgreen.svg
[node-badge]: https://img.shields.io/badge/Node.js-8.0-brightgreen.svg
[strv-home]: https://www.strv.com

# @theframework

[![Build Status][travis-badge]][travis-url]
![Built with GNU Make][make-badge]
![Required Node.js version][node-badge]

> An awesome component-based Node.js framework for all kinds of use cases 🚀<br>
> Built with ❤️ at [STRV][strv-home]

## About

This project aims to reduce code duplication when working on backend APIs by moving some boilerplate code into "packages". Most projects require some kind of database, maybe a remote datastore, some authentication mechanism, perhaps an interface to a 3rd party service and a bunch of other things - why implement the basics over and over again for all projects? Just install a package, add it into the main Application and let it configure the service for you. It will also make sure that the service is shut down properly when the process needs to be terminated so you do not lose important progress or keep your http clients hanging without response (as is the case when stopping a running server with `process.exit()`).

## Core ideas

### What this is?

- A lightweight, component-based state management container
- A container holding any number of small components wrapped into services
- A tool to speed up application development by not having to write the same boilerplate code over and over again

### What this is not?

- An MVC framework
- A microservices framework (you can certainly use this to build microservices, it just does not contain all the related functionality that ie. seneca does)
- Something that will force you to write/organise code in a particular structure
- Something that will force you to use a specific development tool

## Components

### Application

The `Application` class is the primary container holding and managing your services. It provides a very basic functionality which consists of:

- Gathering and distributing all of your configuration to all registered components
- Managing your components' lifecycle (starting/stopping services, executing hooks etc.)

### Service

A Service is a component which usually connects or interacts with an external service or other interface (like a database). The most common trait of all services is that they have state - ie. an open connection. The purpose of a `Service` component is to manage that state for you so that you don't have to (ie. connecting, reconnecting and disconnecting from a database). There are lots of "official" services available for you to use or you can implement your own (and contribute them to the project, if you like!).

### Hook

A hook is basically an event listener which can react to various application lifecycle events (ie. when the application is about to start or just before stopping). A hook is a great way to perform custom actions when particular things happen with the `Application` container.

### Action

An action is basically a controller in the MVC architecture - it is a group of related functions which perform a business-specific task. An action can receive its configuration, but is otherwise stateless - it should only receive some input on the method, interact with any number of services and return output. This is a great place to put some business logic, because it can then be used from any place, ie. an http route handler, a CLI utility or any other place you can imagine.

## Installation

You always need to install the core package:

`npm i --save @theframework/core`

If you want, you can install any of the official services (you can always write your own if none of them suit your needs). Let's install the `koa` service:

`npm i --save @theframework/koa`

That's it! Nothing else needs to be installed. 🎉

## Usage

> This is a complete usage example. Real world apps would split at least the configuration part out into its own module instead of writing it inline like this.

> Also, you may want to check out `Application.init()`, which initialises all the components for you based on file/folder layout you specify. 💪

```js
// We start by importing the required components...
import { Application } from '@theframework/core'
import * as Koa from '@theframework/koa'

// Now we need an instance of the app, so let's make one
const app = new Application({
  // We MUST specify the root folder where our app resides
  // This should usually point to the folder where your package.json resides
  root: __dirname,
  // Setting env is optional and it fallbacks to NODE_ENV, of course
  env: process.env.NODE_ENV,
  // This is where all the configuration data should be specified, for all the components
  config: {
    // Configuration for services
    services: {
      // The `http` configuration will be given to the service which we will name as `http`
      // (see the `app.service()` call below)
      http: {
        // This goes to the `listen()` function call
        server: {
          port: 3000,
        },
        // Any properties which Koa supports can be set here
        koa: {
          proxy: true,
        },
      },
    },
    // Configuration for actions
    actions: {},
    // ...aaand configuration for hooks
    hooks: {},
  },
})

// We need to add the components we want to use to the application
// The first argument is the component's name - it will be used to locate the component's configuration and also the service will be exposed on that property:
// `app.services.http`, or from another component, `this.component('service:http')`
app.service('http', Koa.Service)

// Great, we can finally start the app!
app.start()
.then(() => console.log('ready!'))
.catch(err => console.error(err))

export { app }
```

The configuration options each component accepts are documented in their own package repository/folder.

#### Great... what now?

So you have an app with a Koa service configured and running... Great! But you probably wonder where to define your middleware and routes and all the other important things?

### Meet hooks

Hooks are a piece of code designed to react to some lifecycle events that the framework supports. We need to define our middleware and routes after the Koa service has been initialised (prepared, in the framework's jargon), but before it starts accepting connections.

The following events are currently supported:

- `application:prepare:after` - Use this event to modify or otherwise enhance your components with extra functionality
- `application:start:before` - Use this event to further configure the service with custom middleware, or register database models or perform other important tasks to prepare the service for handling requests.
- `application:start:after` - The application is ready for prime time at this moment and services which accept connections are accepting them now. Use this to ie. start workers or schedule jobs.
- `application:stop:before` - The application has been requested to be shut down (by calling `app.stop()`) - use this to stop workers or perform other important tasks. Note, however, that at this moment all services are still accepting requests, so do not shut down anything important!
- `application:stop:after` - All services have been stopped or disconnected and the components are no longer available - use this to save important information to disk or perform other important cleanup.

To add middleware to our Koa service, it seems the best fit would be to listen for the `application:start:before` event. But it turns out that this is such a common use case that the `@theframework/koa` package already bundles a middleware loader hook! So let's use it!

```js
app.hook('middleware', Koa.MiddlewareHook, {
  aliases: {
    'service:koa': 'http',
  },
})
```

**Wait, what's that third argument there...?**

You might have noticed that you can name your components in any way you like. This gives you the flexibility to use a component as many times in a single app as you need. However, sometimes a component needs to interact with another component (like that middleware hook needs to talk to our Koa service, which we named `http`) and to do that, we need to tell the Hook where to look for `service:koa`. All components define the names of other components they expect to find and it is your task to tell them where to find them.

See the [tutorials](tutorials) directory with detailed code examples and descriptions.

## License

See the [LICENSE](LICENSE) file for information.
