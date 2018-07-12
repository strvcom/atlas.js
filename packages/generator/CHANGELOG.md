# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.1.0"></a>
# [2.1.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/generator-atlas@2.0.0...@atlas.js/generator-atlas@2.1.0) (2018-07-12)


### Bug Fixes

* **generator:** always install latest versions od deps ([1a06563](https://github.com/strvcom/atlas.js/commit/1a06563))
* **generator:** do not include unnecessary whitespace in .editorconfig ([d1e705e](https://github.com/strvcom/atlas.js/commit/d1e705e))
* **generator:** fix noop's dependency on non-existent package version ([907f6b7](https://github.com/strvcom/atlas.js/commit/907f6b7))
* **generator:** include babel-syntax-object-rest-spread plugin ([4bb4fe7](https://github.com/strvcom/atlas.js/commit/4bb4fe7))


### Features

* **generator:** always pretty-print logs locally, add test.mjs config ([dfec246](https://github.com/strvcom/atlas.js/commit/dfec246))
* **generator:** enable pretty print and lower log level on development ([f5acbb4](https://github.com/strvcom/atlas.js/commit/f5acbb4))
* **generator:** include dotenv in the output ([ab38b8c](https://github.com/strvcom/atlas.js/commit/ab38b8c))
* **generator:** include local.mk in the output ([e487932](https://github.com/strvcom/atlas.js/commit/e487932))
* **generator:** makefile is now simpler and distclean works again ([ffb901e](https://github.com/strvcom/atlas.js/commit/ffb901e))
* **generator:** optionally generate ESLint configuration 🎨 ([45f2d56](https://github.com/strvcom/atlas.js/commit/45f2d56))
* **generator:** optionally generate test suite 🚀 ([2761441](https://github.com/strvcom/atlas.js/commit/2761441))
* **generator:** optionally generate VS Code configuration files ([adb2e70](https://github.com/strvcom/atlas.js/commit/adb2e70))
* **generator:** switch some files to folders, add README to them ([344ece6](https://github.com/strvcom/atlas.js/commit/344ece6))
* **generator:** upgrade yeoman-generator to 3.0 ([40ea041](https://github.com/strvcom/atlas.js/commit/40ea041))




<a name="2.0.0"></a>
# 2.0.0 (2018-05-22)


### Bug Fixes

* **generator:** actually install the noop service into the project ([fa7a9d4](https://github.com/strvcom/atlas.js/commit/fa7a9d4))
* **generator:** use correct import path in sample noop service ([7b44165](https://github.com/strvcom/atlas.js/commit/7b44165))


### Features

* node.js 10 is now supported release line ([521ac2c](https://github.com/strvcom/atlas.js/commit/521ac2c))
* **generator:** bump [@atlas](https://github.com/atlas).js/service to v2 in the sample noop service ([e6b9568](https://github.com/strvcom/atlas.js/commit/e6b9568))
* **generator:** overhaul Yeoman generator to spit out workable project ([1bf749c](https://github.com/strvcom/atlas.js/commit/1bf749c))


### BREAKING CHANGES

* **generator:** 




<a name="1.0.0"></a>
# [1.0.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/generator-atlas@0.2.0...@atlas.js/generator-atlas@1.0.0) (2017-10-24)


### Bug Fixes

* **generator:** Add missing README 😱 ([26de253](https://github.com/strvcom/atlas.js/commit/26de253))


### Features

* Ditch [@atlas](https://github.com/atlas).js/core,application, add [@atlas](https://github.com/atlas).js/atlas ([1ce02bb](https://github.com/strvcom/atlas.js/commit/1ce02bb)), closes [#23](https://github.com/strvcom/atlas.js/issues/23)
* Expose the atlas instance as this.atlas inside components ([34b0778](https://github.com/strvcom/atlas.js/commit/34b0778)), closes [#24](https://github.com/strvcom/atlas.js/issues/24)
* The Atlas config is now passed via `atlas` key, not `application` ([51b15d6](https://github.com/strvcom/atlas.js/commit/51b15d6)), closes [#26](https://github.com/strvcom/atlas.js/issues/26)
* **generator:** Update boilerplate to use CLI 🍻 ([bf45af0](https://github.com/strvcom/atlas.js/commit/bf45af0))


### BREAKING CHANGES

* 🔥
* 🔥
* 🔥




<a name="0.2.0"></a>
# [0.2.0](https://github.com/strvcom/atlas.js/compare/@atlas.js/generator-atlas@0.1.2...@atlas.js/generator-atlas@0.2.0) (2017-09-27)


### Bug Fixes

* **generator:** Add missing aliases config file ([37de848](https://github.com/strvcom/atlas.js/commit/37de848))
* **generator:** Remove void from Application.init() 🤦 ([0cf5466](https://github.com/strvcom/atlas.js/commit/0cf5466))


### Features

* Switch to .mjs file extension ([0ee25cd](https://github.com/strvcom/atlas.js/commit/0ee25cd))




<a name="0.1.2"></a>
## [0.1.2](https://github.com/strvcom/atlas.js/compare/@atlas.js/generator-atlas@0.1.1...@atlas.js/generator-atlas@0.1.2) (2017-09-26)


### Bug Fixes

* **generator:** Fix path to components' README.md ([aafbf0a](https://github.com/strvcom/atlas.js/commit/aafbf0a))




<a name="0.1.1"></a>
## [0.1.1](https://github.com/strvcom/atlas.js/compare/@atlas.js/generator-atlas@0.1.0...@atlas.js/generator-atlas@0.1.1) (2017-09-26)


### Bug Fixes

* **generator:** Do not check imports in template files to be resolvable ([1822c14](https://github.com/strvcom/atlas.js/commit/1822c14))
* **generator:** Remove unneeded dependency on [@atlas](https://github.com/atlas).js/core ([2614baa](https://github.com/strvcom/atlas.js/commit/2614baa))




<a name="0.1.0"></a>
# 0.1.0 (2017-09-26)


### Bug Fixes

* **generator:** Do not use [@atlas](https://github.com/atlas).js/service package in demo component ([9b07bdf](https://github.com/strvcom/atlas.js/commit/9b07bdf))
* **generator:** Import Service correctly in template ([8770ea0](https://github.com/strvcom/atlas.js/commit/8770ea0))


### Features

* Implement yeoman generator ([7ffb53f](https://github.com/strvcom/atlas.js/commit/7ffb53f))
