# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.2.0-alpha.7](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@3.2.0-alpha.6...@atlas.js/koa@3.2.0-alpha.7) (2019-01-28)


### Bug Fixes

* remove `declare module` wrappers from all d.ts files 🔥 ([c0e7cd5](https://github.com/strvcom/atlas.js/commit/c0e7cd5)), closes [#69](https://github.com/strvcom/atlas.js/issues/69)





# [3.2.0-alpha.6](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@3.2.0-alpha.5...@atlas.js/koa@3.2.0-alpha.6) (2019-01-16)


### Bug Fixes

* **koa:** do not depend on named exports order when iterating middleware ([d28b2d9](https://github.com/strvcom/atlas.js/commit/d28b2d9))





<a name="3.1.1"></a>
## [3.1.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@3.1.0...@atlas.js/koa@3.1.1) (2018-07-16)


### Bug Fixes

* define empty object as default for Ajv ([e9d85be](https://github.com/strvcom/atlas.js/commit/e9d85be))




<a name="3.1.0"></a>
# [3.1.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@3.0.0...@atlas.js/koa@3.1.0) (2018-07-12)


### Features

* **koa:** upgrade koa-websocket to ^5, ws to ^5.2 ([2e094ec](https://github.com/strvcom/atlas.js/commit/2e094ec))




<a name="3.0.0"></a>
# 3.0.0 (2018-05-22)


### Features

* **atlas:** Legendary: overhaul Hooks ([7710edd](https://github.com/strvcom/atlas.js/commit/7710edd)), closes [#35](https://github.com/strvcom/atlas.js/issues/35) [#34](https://github.com/strvcom/atlas.js/issues/34)
* **component:** Drop support for the old resolve constructor param ([394f65d](https://github.com/strvcom/atlas.js/commit/394f65d))
* drop components's static defaults, use static config (JSON schema) ([5c7d5ce](https://github.com/strvcom/atlas.js/commit/5c7d5ce))
* node.js 10 is now supported release line ([521ac2c](https://github.com/strvcom/atlas.js/commit/521ac2c))


### BREAKING CHANGES

* 
* **atlas:** 
* **component:** 




<a name="2.0.0"></a>
# [2.0.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@1.2.0...@atlas.js/koa@2.0.0) (2018-01-18)


### Features

* **koa:** Add websocket support via WebsocketHook ([3cdb05a](https://github.com/strvcom/atlas.js/commit/3cdb05a))
* **koa:** MiddlewareHook is now part of the main service ([e85353b](https://github.com/strvcom/atlas.js/commit/e85353b))


### BREAKING CHANGES

* **koa:** - Remove MiddlewareHook
- Rename Service to Server




<a name="1.2.0"></a>
# [1.2.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@1.1.1...@atlas.js/koa@1.2.0) (2017-12-13)


### Features

* **component:** The resolve() function is now passed as `component` ([dd034d6](https://github.com/strvcom/atlas.js/commit/dd034d6))
* **koa:** Pass the Atlas component to all middleware constructors ([d8d6a67](https://github.com/strvcom/atlas.js/commit/d8d6a67))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@1.0.0...@atlas.js/koa@1.1.0) (2017-11-21)


### Features

* **koa:** Prefer `PORT` env var when binding ([edcc5cd](https://github.com/strvcom/atlas.js/commit/edcc5cd))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.5.0...@atlas.js/koa@1.0.0) (2017-10-24)


### Features

* Ditch [@atlas](https://github.com/atlas).js/core,application, add [@atlas](https://github.com/atlas).js/atlas ([1ce02bb](https://github.com/strvcom/atlas.js/commit/1ce02bb)), closes [#23](https://github.com/strvcom/atlas.js/issues/23)
* Expose the atlas instance as this.atlas inside components ([34b0778](https://github.com/strvcom/atlas.js/commit/34b0778)), closes [#24](https://github.com/strvcom/atlas.js/issues/24)
* Implement sane hook events ([b830760](https://github.com/strvcom/atlas.js/commit/b830760)), closes [#25](https://github.com/strvcom/atlas.js/issues/25)


### BREAKING CHANGES

* 🔥
* 🔥
* 🔥




<a name="0.5.0"></a>
# [0.5.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.4.0...@atlas.js/koa@0.5.0) (2017-09-27)


### Features

* Switch to .mjs file extension ([0ee25cd](https://github.com/strvcom/atlas.js/commit/0ee25cd))




<a name="0.4.0"></a>
# [0.4.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.3.3...@atlas.js/koa@0.4.0) (2017-09-26)


### Features

* **application:** Implement Application.require() ([ba10351](https://github.com/strvcom/atlas.js/commit/ba10351))




<a name="0.3.3"></a>
## [0.3.3](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.3.2...@atlas.js/koa@0.3.3) (2017-09-22)




**Note:** Version bump only for package @atlas.js/koa

<a name="0.3.2"></a>
## [0.3.2](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.3.1...@atlas.js/koa@0.3.2) (2017-09-07)




**Note:** Version bump only for package @atlas.js/koa

<a name="0.3.1"></a>
## [0.3.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.3.0...@atlas.js/koa@0.3.1) (2017-09-05)




**Note:** Version bump only for package @atlas.js/koa

<a name="0.3.0"></a>
# [0.3.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.2.1...@atlas.js/koa@0.3.0) (2017-09-05)


### Features

* **Koa:** Implement ContextHook ([588e462](https://github.com/strvcom/atlas.js/commit/588e462))




<a name="0.2.1"></a>
## [0.2.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.2.0...@atlas.js/koa@0.2.1) (2017-09-02)




**Note:** Version bump only for package @atlas.js/koa

<a name="0.2.0"></a>
# [0.2.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.1.0...@atlas.js/koa@0.2.0) (2017-08-16)


### Features

* **koa:** Update koa config properties to be more self-explanatory ([0af00be](https://github.com/strvcom/atlas.js/commit/0af00be))




<a name="0.1.0"></a>
# [0.1.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.0.2...@atlas.js/koa@0.1.0) (2017-08-16)




<a name="0.0.2"></a>
## [0.0.2](https://github.com/strvcom/atlas.js/compare/@atlas.js/koa@0.0.1...@atlas.js/koa@0.0.2) (2017-08-10)




<a name="0.0.1"></a>
## 0.0.1 (2017-08-10)
