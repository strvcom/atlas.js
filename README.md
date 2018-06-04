# ![Atlas.js][atlas-logo] @atlas.js

[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
![Built with GNU Make][make-badge]
![Required Node.js version][node-badge]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper-url]

> Built with ❤️ at [STRV][strv-home]

Atlas.js is a component-based library for writing Node.js apps of all kinds of purposes. Its main goal was to encapsulate common application boilerplate code into a set of small, reusable components so that you can focus on writing code specific to your needs. You just provide the configuration for each component and you are good to go.

## Available components

Here is a list of STRV-maintained components.

|Component|Version|Info|
|-|-|-|
|[@atlas.js/atlas](packages/atlas)|[![@atlas.js/atlas][atlas-npm-version]][atlas-npm-home]|The main package with everything needed to get rolling|
|[@atlas.js/cli](packages/cli)|[![@atlas.js/cli][cli-npm-version]][cli-npm-home]|A CLI utility to manage your Atlas app|
|[@atlas.js/generator-atlas](packages/generator)|[![@atlas.js/generator-atlas][generator-npm-version]][generator-npm-home]|Yeoman generator to quickly scaffold your new Atlas app|
|[@atlas.js/aws](packages/aws)|[![@atlas.js/atlas][aws-npm-version]][aws-npm-home]|For interfacing with AWS|
|[@atlas.js/braintree](packages/braintree)|[![@atlas.js/atlas][braintree-npm-version]][braintree-npm-home]|For interfacing with Braintree payments|
|[@atlas.js/firebase](packages/firebase)|[![@atlas.js/atlas][firebase-npm-version]][firebase-npm-home]|For interfacing with Firebase services|
|[@atlas.js/koa](packages/koa)|[![@atlas.js/atlas][koa-npm-version]][koa-npm-home]|Service and hooks for implementing Koa-based HTTP APIs|
|[@atlas.js/mongoose](packages/mongoose)|[![@atlas.js/atlas][mongoose-npm-version]][mongoose-npm-home]|Service and hooks for working with MongoDB and Mongoose models|
|[@atlas.js/objection](packages/objection)|[![@atlas.js/atlas][objection-npm-version]][objection-npm-home]|Service and hooks for working with Objection.js|
|[@atlas.js/sequelize](packages/sequelize)|[![@atlas.js/atlas][sequelize-npm-version]][sequelize-npm-home]|Service and hooks for working with Sequelize|
|[@atlas.js/nodemailer](packages/nodemailer)|[![@atlas.js/atlas][nodemailer-npm-version]][nodemailer-npm-home]|Generic emailing service with support for multiple providers|
|[@atlas.js/repl](packages/repl)|[![@atlas.js/atlas][repl-npm-version]][repl-npm-home]|A component to drop into an interactive shell with Atlas loaded|
|[@atlas.js/templates](packages/templates)|[![@atlas.js/atlas][templates-npm-version]][templates-npm-home]|Action for rendering templates into html strings using consolidate.js|

> Did not find what you were looking for? Write your own! Check the tutorials linked below.

## Tutorials

Need help? Check out the [tutorials](tutorials) folder for... well... tutorials. 🤓

## Core ideas

### What this is?

- A lightweight, component-based state management container
- A tool to speed up application development by not having to write the same boilerplate code over and over again

### What this is not?

- An MVC framework
- A microservices framework (you can certainly use this to build microservices, it just does not contain the functionality that such a framework should have)

## Components

### Atlas

The `Atlas` class is the primary container holding and managing your services. It provides a very basic functionality which consists of:

- Gathering and distributing all of your configuration to all registered components
- Managing your components' lifecycle (starting/stopping services, running hooks etc.)

### Service

A Service is a component which usually connects or interacts with an external service or other interface (like a database). The most common trait of all services is that they have state - ie. an open connection. The purpose of a `Service` component is to manage that state for you so that you don't have to (ie. connecting, reconnecting and disconnecting from a database).

### Hook

A hook is basically an event listener which can react to various application lifecycle events (ie. when the application is about to start or just before stopping). A hook is a great way to perform custom actions when particular things happen within the `Atlas` container (ie. run database migrations when starting).

### Action

Actions are a group of stateless functions which receive some input and generate an output. Their use within Atlas.js is completely optional but they are a great place to put business-specific code. Their main benefit is that they are reusable - you could call an action either from a CLI utility or from a route handler - they do not depend on the surrounding context.

## Installation

You always need to install the main `atlas` package:

`npm i --save @atlas.js/atlas`

If you want, you can install any of the official components (you can always write your own if none of them suit your needs). Let's install the `koa` component:

`npm i --save @atlas.js/koa`

That's it! Nothing else needs to be installed. 🎉

## Usage

> This is a complete usage example. Real world apps would split at least the configuration part out into its own module instead of writing it inline like this.
>
> Also, you may want to check out `Atlas.init()`, which initialises all the components for you based on file/folder layout you specify. 💪
>
> If you would like to take the easy road, check out our [Yeoman generator][generator-npm-home] to quickly generate the basic folder structure and install all the needed things.

```js
// We start by importing the required components...
import { Atlas } from '@atlas.js/atlas'
import * as Koa from '@atlas.js/koa'

// Now we need an instance of Atlas, so let's make one
const atlas = new Atlas({
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
      // (see the `atlas.service()` call below)
      http: {
        // This goes to the `listen()` function call
        listen: {
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
// `atlas.services.http`
atlas.service('http', Koa.Service)

// Great, we can finally start the app!
atlas.start()
.then(() => console.log('ready!'))
.catch(err => console.error(err))

export default atlas
```

The configuration options each component accepts are documented in their own package repository/folder.

### Great... what now?

So you have an app with a Koa service configured and running... Great! But you probably wonder where to define your middleware and routes and all the other important things? You should check out the [tutorials](tutorials) folder for much more info!

## License

See the [LICENSE](LICENSE) file for information.

[atlas-logo]: https://user-images.githubusercontent.com/3058150/40908805-197d3c3e-67e8-11e8-97a8-b275edc325b9.png
[travis-badge]: https://img.shields.io/travis/strvcom/atlas.js.svg?style=flat-square
[travis-url]: https://travis-ci.org/strvcom/atlas.js
[make-badge]: https://img.shields.io/badge/Built%20with-GNU%20Make-brightgreen.svg?style=flat-square
[node-badge]: https://img.shields.io/badge/Node.js-8.3-brightgreen.svg?style=flat-square
[coveralls-badge]: https://img.shields.io/coveralls/strvcom/atlas.js.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/strvcom/atlas.js
[greenkeeper-badge]: https://badges.greenkeeper.io/strvcom/atlas.js.svg
[greenkeeper-url]: https://greenkeeper.io
[strv-home]: https://www.strv.com
[atlas-npm-version]: https://img.shields.io/npm/v/@atlas.js/atlas.svg?style=flat-square
[cli-npm-version]: https://img.shields.io/npm/v/@atlas.js/cli.svg?style=flat-square
[aws-npm-version]: https://img.shields.io/npm/v/@atlas.js/aws.svg?style=flat-square
[braintree-npm-version]: https://img.shields.io/npm/v/@atlas.js/braintree.svg?style=flat-square
[generator-npm-version]: https://img.shields.io/npm/v/@atlas.js/generator-atlas.svg?style=flat-square
[firebase-npm-version]: https://img.shields.io/npm/v/@atlas.js/firebase.svg?style=flat-square
[koa-npm-version]: https://img.shields.io/npm/v/@atlas.js/koa.svg?style=flat-square
[mongoose-npm-version]: https://img.shields.io/npm/v/@atlas.js/mongoose.svg?style=flat-square
[objection-npm-version]: https://img.shields.io/npm/v/@atlas.js/objection.svg?style=flat-square
[sequelize-npm-version]: https://img.shields.io/npm/v/@atlas.js/sequelize.svg?style=flat-square
[nodemailer-npm-version]: https://img.shields.io/npm/v/@atlas.js/nodemailer.svg?style=flat-square
[repl-npm-version]: https://img.shields.io/npm/v/@atlas.js/repl.svg?style=flat-square
[templates-npm-version]: https://img.shields.io/npm/v/@atlas.js/templates.svg?style=flat-square
[atlas-npm-home]: https://npmjs.org/package/@atlas.js/atlas
[cli-npm-home]: https://npmjs.org/package/@atlas.js/cli
[aws-npm-home]: https://npmjs.org/package/@atlas.js/aws
[braintree-npm-home]: https://npmjs.org/package/@atlas.js/braintree
[generator-npm-home]: https://npmjs.org/package/@atlas.js/generator-atlas
[firebase-npm-home]: https://npmjs.org/package/@atlas.js/firebase
[koa-npm-home]: https://npmjs.org/package/@atlas.js/koa
[mongoose-npm-home]: https://npmjs.org/package/@atlas.js/mongoose
[sequelize-npm-home]: https://npmjs.org/package/@atlas.js/sequelize
[nodemailer-npm-home]: https://npmjs.org/package/@atlas.js/nodemailer
[objection-npm-home]: https://npmjs.org/package/@atlas.js/objection
[repl-npm-home]: https://npmjs.org/package/@atlas.js/repl
[templates-npm-home]: https://npmjs.org/package/@atlas.js/templates
