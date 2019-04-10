# ![Atlas.js][atlas-logo] @atlas.js

[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
![Built with GNU Make][make-badge]
![Required Node.js version][node-badge]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper-url]

> Built with ❤️ at [STRV][strv-home]

Atlas.js is a platform primarily made for re-using pieces of code among multiple projects and to reduce common application boilerplate like the startup & shutdown sequences of a standard Node.js app. You write components (or use ours) which provide functionality (like a database component), put them into an Atlas instance and Atlas will take care of the rest. Using Atlas you reduce your application initialisation and shutdown sequence into a configuration object and one line of code.

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

## About

### Motivations

The following section talks about the motivations behind the existence of Atlas.js.

#### Code reusability

When you get familiar with Atlas.js and the STRV-made components you will start to see and even feel that a great deal of effort has been put into making sure you can share a lot of code between projects. Whenever possible, Atlas.js will try to guide you in such a way that you should be able to write quite a lot of code in a way that is not business-specific and just publish it to npm as a module and later when you need it again on a different project, simply install it again and it all just works.

#### Managing startup/shutdown

Managing the startup sequence is not always easy. Sometimes it is not even clear why someone should bother themselves with a correct startup sequence of an app - nowadays many libraries that require some async initialisation support some kind of request caching where you simply start using the library and it will deliver the results when it is ready.

This has several problems:

- Some services could be started sooner than others
  > When you start an HTTP server before you have a database connection ready, it could happen that you will receive traffic that you are not yet ready to serve. For small loads this might not be a problem but for high traffic sites it could mean several seconds of delays and you might even exhaust your available memory just by caching the pending requests for too long. In case this kind of request caching is not supported it is even possible your app will just crash.

- Some services could be stopped sooner than others
  > What happens to your application when you close down your database connection before you close down the HTTP server? Sure, it's easily manageable with just two services, but what if you have more? Maybe you have some Redis server somewhere in there, maybe some ElasticSearch cluster connection and other whatnots - it could get quite complicated quite fast. With Atlas, you intuitively provide the order and it's done - Atlas will stop the services one by one.

- Some developers don't care and just `process.exit()` the thing
  > Some developers do not want to be bothered with properly cleaning up their resources like timeouts, sockets, listeners etc. and when the time comes they just force-quit the process. However, this could result in some client requests being terminated before delivering a response, resulting in weird errors, empty pages, incomplete data etc.

#### Similar architecture between projects

When you decide to go all in on what Atlas.js offers and use the components to its fullest you will soon realise that it is very easy to navigate a completely unfamiliar codebase with relative ease - you know what is where and where to look for a specific functionality. When you work for a company like STRV it is not uncommon to switch projects every few months or so. When you can reduce the time needed to onboard a new guy/gal to your team all parties involved will be happier.

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
// The first argument is the component's name - it will be used to locate the component's
// configuration and also the service will be exposed on that property:
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
