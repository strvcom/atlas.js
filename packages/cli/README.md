# @atlas.js/cli

A CLI utility to work with Atlas applications.

## Installation

The CLI is best used as a local dependency, but it may be installed globally, too.

`npm i @atlas.js/cli`

Once installed, you will have `atlas` command available in your _node_modules/.bin/_ directory (for local installations) or in your `$PATH` (for global installations).

## Prerequisites

- The `atlas` CLI should be invoked from the working directory where you have your Atlas application code. Optionally, you can specify another path by providing the `--root /path/to/project` flag.
- It must be possible to call `require()` or `import` on the root/current working directory and get a configured and unstarted instance of the Atlas class. To achieve this, your project's entry point should look something like this:
    ```js
    import { Atlas } from '@atlas.js/atlas'
    const app = new Atlas({
      /* configuration */
    })
    export default app
    // or
    module.exports = app
    ```
  If you created your app using the [Yeoman generator][atlas-generator] this is already taken care of for you.

## Usage

We will focus on local installations from now on.

From your project root, do one of

```sh
node_modules/.bin/atlas
npx atlas  # For npm 5.3 and newer
```

![atlas CLI example][atlas-cli-screenshot]

You will see a pretty help message with usage instructions.

## Shell autocompletion

The CLI supports basic autocomplete features. You can enable it by running:

`source <(node_modules/.bin/atlas completion bash|zsh|fish)`

You can optionally save this to your shell's _rc_ file.

## License

See the [LICENSE](LICENSE) file for information.

[atlas-cli-screenshot]: https://user-images.githubusercontent.com/3058150/31718630-eafccd7e-b410-11e7-9417-e4b7ea3c29fa.png
[atlas-generator]: https://npmjs.org/package/@atlas.js/generator-atlas
