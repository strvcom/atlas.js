# Migration guide

## 0.x -> 1.x

**_@atlas.js/core_, _@atlas.js/application_ packages are replaced with _@atlas.js/atlas_**

- Update your _package.json_ file and remove any of those packages. Then install _@atlas.js/atlas_.
- In your code, update your `import`/`require` statements to use the new package name

> With the current project structure it was difficult to properly manage releases of the _@atlas.js/core_ to follow semver. We decided to merge the two packages into one so that proper semantic versioning can be achieved.

**The `Application` class has been renamed to `Atlas`**

- In your code, replace all references of `import { Application } from '@atlas.js/core'` to `import { Atlas } from '@atlas.js/atlas'`

> `Application` was too generic. We decided to rename the class to `Atlas` to make it explicit about what you are working with.

**In components, the `Atlas` instance is now available as `this.atlas`**

- In your code, within components, change all references of `this.app` to `this.atlas`

> `app` was too generic and even conflicted with Koa's `ctx.app` (the Koa instance). We decided to rename the variable to make it obvious what you are working with.

**Configuration for Atlas is now provided via `atlas` configuration key**

- In your configuration object, change the `application` configuration key to `atlas` configuration key.

> Again, `application` was too generic. Now it is more obvious that the configuration object belongs to Atlas.

**Hook listeners have been renamed to look more like standard class methods**

- In your Hooks' code, replace all hook methods with their new names:
  - `application:prepare:after` -> `afterPrepare`
  - `application:start:before` -> `beforeStart`
  - `application:start:after` -> `afterStart`
  - `application:stop:before` -> `beforeStop`
  - `application:stop:after` -> `afterStop`

> The original idea behind such a weird function names was that it would be possible to listen for events coming from other components, ie listening for `database:start:before`. Ultimately we decided to not support such functionality at the moment.
