# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.2.0-alpha.7](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@2.2.0-alpha.6...@atlas.js/atlas@2.2.0-alpha.7) (2019-01-28)


### Bug Fixes

* **atlas:** init parameters typings ([efdbf3c](https://github.com/strvcom/atlas.js/commit/efdbf3c))





# [2.2.0-alpha.6](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@2.2.0-alpha.5...@atlas.js/atlas@2.2.0-alpha.6) (2019-01-28)


### Bug Fixes

* remove `declare module` wrappers from all d.ts files 🔥 ([c0e7cd5](https://github.com/strvcom/atlas.js/commit/c0e7cd5)), closes [#69](https://github.com/strvcom/atlas.js/issues/69)





# [2.2.0-alpha.5](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@2.2.0-alpha.4...@atlas.js/atlas@2.2.0-alpha.5) (2019-01-16)


### Bug Fixes

* **atlas:** do not depend on named exports order when iterating services ([d75862b](https://github.com/strvcom/atlas.js/commit/d75862b))





<a name="2.1.0"></a>
# [2.1.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@2.0.0...@atlas.js/atlas@2.1.0) (2018-07-12)


### Bug Fixes

* **atlas:** clean up observers after component stops ([ae31b16](https://github.com/strvcom/atlas.js/commit/ae31b16))


### Features

* **atlas:** allow components to only access dependencies they require ([653898d](https://github.com/strvcom/atlas.js/commit/653898d)), closes [#54](https://github.com/strvcom/atlas.js/issues/54)
* **atlas:** allow some components to not be exposed (internal) ([cd2c4a7](https://github.com/strvcom/atlas.js/commit/cd2c4a7)), closes [#46](https://github.com/strvcom/atlas.js/issues/46)




<a name="2.0.0"></a>
# 2.0.0 (2018-05-22)


### Bug Fixes

* **atlas:** avoid Ajv warning due to incompatible configuration ([4d1592d](https://github.com/strvcom/atlas.js/commit/4d1592d))


### Features

* **atlas:** allow components to define their config schema 💪 ([ecd54d8](https://github.com/strvcom/atlas.js/commit/ecd54d8)), closes [#28](https://github.com/strvcom/atlas.js/issues/28)
* **atlas:** Allow components to emit custom events 💪 ([ba02799](https://github.com/strvcom/atlas.js/commit/ba02799)), closes [#34](https://github.com/strvcom/atlas.js/issues/34)
* **atlas:** allow JSON schemas to use ajv-keywords ([70b42f2](https://github.com/strvcom/atlas.js/commit/70b42f2))
* **atlas:** Implement Atlas.bootstrap() 🚀 ([d6f1101](https://github.com/strvcom/atlas.js/commit/d6f1101))
* **atlas:** Legendary: overhaul Hooks ([7710edd](https://github.com/strvcom/atlas.js/commit/7710edd)), closes [#35](https://github.com/strvcom/atlas.js/issues/35) [#34](https://github.com/strvcom/atlas.js/issues/34)
* **atlas:** Log when a hook receives event it cannot handle ([0939822](https://github.com/strvcom/atlas.js/commit/0939822)), closes [#34](https://github.com/strvcom/atlas.js/issues/34)
* node.js 10 is now supported release line ([521ac2c](https://github.com/strvcom/atlas.js/commit/521ac2c))


### BREAKING CHANGES

* **atlas:** 




<a name="1.3.1"></a>
## [1.3.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@1.3.0...@atlas.js/atlas@1.3.1) (2018-02-12)


### Bug Fixes

* **atlas:** Properly handle service errors during start/stop ([86d2ae9](https://github.com/strvcom/atlas.js/commit/86d2ae9)), closes [#29](https://github.com/strvcom/atlas.js/issues/29)




<a name="1.3.0"></a>
# [1.3.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@1.2.1...@atlas.js/atlas@1.3.0) (2018-02-08)


### Features

* **atlas:** Allow Pino's serializers to be loaded from a module ([cca2429](https://github.com/strvcom/atlas.js/commit/cca2429))
* **atlas:** Atlas.require() can normalise default and named exports ([76e1f74](https://github.com/strvcom/atlas.js/commit/76e1f74))




<a name="1.2.1"></a>
## [1.2.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@1.2.0...@atlas.js/atlas@1.2.1) (2018-01-30)


### Bug Fixes

* **atlas:** Log about the config provided to the component ([861c3b4](https://github.com/strvcom/atlas.js/commit/861c3b4))
* **atlas:** Lower log level to trace for some log messages ([cd6c52f](https://github.com/strvcom/atlas.js/commit/cd6c52f))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@1.1.2...@atlas.js/atlas@1.2.0) (2017-12-13)


### Features

* **component:** The resolve() function is now passed as `component` ([dd034d6](https://github.com/strvcom/atlas.js/commit/dd034d6))




<a name="1.1.1"></a>
## [1.1.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@1.1.0...@atlas.js/atlas@1.1.1) (2017-11-09)


### Bug Fixes

* **atlas:** Log the component's type and alias when it's not a class ([19c0781](https://github.com/strvcom/atlas.js/commit/19c0781))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@1.0.1...@atlas.js/atlas@1.1.0) (2017-11-06)


### Features

* Allow atlas.require() to load models without resolving first ([7a68a47](https://github.com/strvcom/atlas.js/commit/7a68a47))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/atlas@1.0.0...@atlas.js/atlas@1.0.1) (2017-10-30)


### Bug Fixes

* **atlas:** Do not mask errors thrown in component modules ([73127aa](https://github.com/strvcom/atlas.js/commit/73127aa))




<a name="1.0.0"></a>
# 1.0.0 (2017-10-24)


### Features

* Ditch [@atlas](https://github.com/atlas).js/core,application, add [@atlas](https://github.com/atlas).js/atlas ([1ce02bb](https://github.com/strvcom/atlas.js/commit/1ce02bb)), closes [#23](https://github.com/strvcom/atlas.js/issues/23)
* Expose the atlas instance as this.atlas inside components ([34b0778](https://github.com/strvcom/atlas.js/commit/34b0778)), closes [#24](https://github.com/strvcom/atlas.js/issues/24)
* Implement sane hook events ([b830760](https://github.com/strvcom/atlas.js/commit/b830760)), closes [#25](https://github.com/strvcom/atlas.js/issues/25)
* The Atlas config is now passed via `atlas` key, not `application` ([51b15d6](https://github.com/strvcom/atlas.js/commit/51b15d6)), closes [#26](https://github.com/strvcom/atlas.js/issues/26)


### BREAKING CHANGES

* 🔥
* 🔥
* 🔥
* 🔥
