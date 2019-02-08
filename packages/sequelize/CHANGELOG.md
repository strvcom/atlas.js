# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@2.0.1...@atlas.js/sequelize@2.1.0) (2019-02-08)


### Bug Fixes

* add default empty objects to JSON schema configurations ([1b7b006](https://github.com/strvcom/atlas.js/commit/1b7b006))
* component lifecycle methods should always return Promise ([2417929](https://github.com/strvcom/atlas.js/commit/2417929))
* declarations for object shapes should use `type`, not `interface` ([7928e6a](https://github.com/strvcom/atlas.js/commit/7928e6a))
* remove `declare module` wrappers from all d.ts files 🔥 ([c0e7cd5](https://github.com/strvcom/atlas.js/commit/c0e7cd5)), closes [#69](https://github.com/strvcom/atlas.js/issues/69)


### Features

* **sequelize:** add typings ([e981ce2](https://github.com/strvcom/atlas.js/commit/e981ce2))
* **sequelize:** export the whole module ([156dcd2](https://github.com/strvcom/atlas.js/commit/156dcd2))
* **sequelize:** expose Atlas instance to the models ([41516d2](https://github.com/strvcom/atlas.js/commit/41516d2))





# [2.1.0-alpha.8](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@2.1.0-alpha.7...@atlas.js/sequelize@2.1.0-alpha.8) (2019-01-28)

**Note:** Version bump only for package @atlas.js/sequelize





# [2.1.0-alpha.7](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@2.1.0-alpha.6...@atlas.js/sequelize@2.1.0-alpha.7) (2019-01-28)


### Bug Fixes

* remove `declare module` wrappers from all d.ts files 🔥 ([c0e7cd5](https://github.com/strvcom/atlas.js/commit/c0e7cd5)), closes [#69](https://github.com/strvcom/atlas.js/issues/69)





# [2.1.0-alpha.6](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@2.1.0-alpha.5...@atlas.js/sequelize@2.1.0-alpha.6) (2019-01-16)

**Note:** Version bump only for package @atlas.js/sequelize





<a name="2.0.1"></a>
## [2.0.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@2.0.0...@atlas.js/sequelize@2.0.1) (2018-07-12)




**Note:** Version bump only for package @atlas.js/sequelize

<a name="2.0.0"></a>
# 2.0.0 (2018-05-22)


### Features

* **atlas:** Legendary: overhaul Hooks ([7710edd](https://github.com/strvcom/atlas.js/commit/7710edd)), closes [#35](https://github.com/strvcom/atlas.js/issues/35) [#34](https://github.com/strvcom/atlas.js/issues/34)
* drop components's static defaults, use static config (JSON schema) ([5c7d5ce](https://github.com/strvcom/atlas.js/commit/5c7d5ce))
* node.js 10 is now supported release line ([521ac2c](https://github.com/strvcom/atlas.js/commit/521ac2c))


### BREAKING CHANGES

* 
* **atlas:** 




<a name="1.1.0"></a>
# [1.1.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@1.0.1...@atlas.js/sequelize@1.1.0) (2017-12-13)


### Features

* **component:** The resolve() function is now passed as `component` ([dd034d6](https://github.com/strvcom/atlas.js/commit/dd034d6))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@0.4.0...@atlas.js/sequelize@1.0.0) (2017-10-24)


### Features

* **sequelize:** Export Op object from the Sequelize package ([08a9a4e](https://github.com/strvcom/atlas.js/commit/08a9a4e))
* Ditch [@atlas](https://github.com/atlas).js/core,application, add [@atlas](https://github.com/atlas).js/atlas ([1ce02bb](https://github.com/strvcom/atlas.js/commit/1ce02bb)), closes [#23](https://github.com/strvcom/atlas.js/issues/23)
* Expose the atlas instance as this.atlas inside components ([34b0778](https://github.com/strvcom/atlas.js/commit/34b0778)), closes [#24](https://github.com/strvcom/atlas.js/issues/24)
* Implement sane hook events ([b830760](https://github.com/strvcom/atlas.js/commit/b830760)), closes [#25](https://github.com/strvcom/atlas.js/issues/25)


### BREAKING CHANGES

* 🔥
* 🔥
* 🔥




<a name="0.4.0"></a>
# [0.4.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@0.3.0...@atlas.js/sequelize@0.4.0) (2017-09-27)


### Features

* Switch to .mjs file extension ([0ee25cd](https://github.com/strvcom/atlas.js/commit/0ee25cd))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@0.2.1...@atlas.js/sequelize@0.3.0) (2017-09-26)


### Features

* **application:** Implement Application.require() ([ba10351](https://github.com/strvcom/atlas.js/commit/ba10351))




<a name="0.2.1"></a>
## [0.2.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@0.2.0...@atlas.js/sequelize@0.2.1) (2017-09-22)




**Note:** Version bump only for package @atlas.js/sequelize

<a name="0.2.0"></a>
# [0.2.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@0.1.1...@atlas.js/sequelize@0.2.0) (2017-09-07)


### Features

* **sequelize:** Allow accessing Atlas on model instances ([66ac499](https://github.com/strvcom/atlas.js/commit/66ac499))
* **sequelize:** Implement MigrationAction ([3920528](https://github.com/strvcom/atlas.js/commit/3920528))




<a name="0.1.1"></a>
## [0.1.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/sequelize@0.1.0...@atlas.js/sequelize@0.1.1) (2017-09-06)




**Note:** Version bump only for package @atlas.js/sequelize

<a name="0.1.0"></a>
# 0.1.0 (2017-09-02)


### Features

* Implement Sequelize service ([6b1a719](https://github.com/strvcom/atlas.js/commit/6b1a719))
