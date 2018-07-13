# Atlas.js app

## General information

- This project utilises ES2015 modules and class properties language features, therefore it needs Babel as a compiler
- All tasks related to building/checking/testing the project are defined in _makefile_.
- Some additional helper scripts are in the _bin/_ directory - check them out!

## Getting started

The included _makefile_ has everything it needs to build this project. Depending on what you selected to have included during the project scaffolding process, it includes the following targets:

- `make`: Compile all JavaScript files using Babel, optionally also install Node.js modules if they are not installed yet
- `make compile`: Compile all JavaScript files **modified** since last compilation
- `make lint`: Lint all JavaScript files using ESLint (optional)
- `make test`: Run the test suite using Mocha (optional)
- `make inspect`: Run the test suite with the Chrome Inspector protocol enabled, pausing the process on first JavaScript line (optional)
- `make coverage`: Generate code coverage report as LCOV and HTML (use `open coverage/index.html` to see the report) (optional)
- `make clean/distclean`: Remove generated data (coverage reports etc.)/remove all compiled JavaScript files

## Usage

This project uses the [Atlas.js' CLI][atlas-cli-npm] to start the app. You are not required to use it, but it makes a lot of things easier for you as it manages the following:

- It handles terminating signals and stops your app gracefully
- It starts the Atlas.js app for you using the recommended way
- It attempts to gracefully stop the app even in case of unexpected errors

If you decide to not use the CLI you will have to add [all of these things][cli-start-script] yourself. But why would you do that...? 🤔

### Starting the app

```sh
./bin/atlas start
```

> **Note:** If you do not add any service which would keep the process running (ie. a web server) the app will terminate right away because it has nothing to do (the event loop is empty). This is how Node.js works and it has nothing to do with the CLI or Atlas.js or with your code.

#### Production deployments

When deploying to production, you should not use the `./bin/atlas` script as it requires _devDependencies_. Instead, run the Atlas.js CLI directly:

```sh
./node_modules/.bin/atlas start
```

### Configuration

There are several places to define your configuration:

- **_src/config/index.mjs_**: The main configuration point for your app. This should represent the _ideal_ state, ie. _production_.
- **_src/config/env/*.mjs_**: You can define overrides based on current environment (*NODE_ENV*)
- **_src/config/local.mjs_**: You can place configuration overrides specific to your machine/work preferences here. This file is git-ignored so it's safe to override absolutely anything here. This file is applied on top of the main and the environment-specific configuration options (it has the highest priority).
- **_.env_**: The usual. Put there any environment variables you need to have when working locally. This file is only loaded if you start the process using _.bin/atlas_ CLI or when running tests using the generated test suite.
- **_local.mk_**: You can extend/enhance your workflow with custom Make targets or add flags to existing commands (see the [_makefile_](makefile) for reference). This file is git-ignored so your changes will not affect other developers' workflows.

## Next steps

You should probably start adding some components! Check out those [already available][atlas-components]. If you cannot find what you need, you can implement it yourself. Always consider opening a pull request against Atlas.js repository to make your component available for everyone so that others do not have to create that same component themselves again. ❤️

[atlas-cli-npm]: https://www.npmjs.com/package/@atlas.js/cli
[cli-start-script]: https://github.com/strvcom/atlas.js/blob/master/packages/cli/src/commands/start.mjs
[atlas-components]: https://github.com/strvcom/atlas.js#available-components
