# @atlas.js/repl

This package contains an action which allows you to drop into an interactive shell (REPL) with the application exposed as `atlas` on the console.

## Usage

```js
import { Atlas } from '@atlas.js/atlas'
import { Action as Repl } from '@atlas.js/repl'

atlas.action('repl', Repl)
await atlas.prepare() // or atlas.start(), up to you
// Drop into REPL! 🚀
// Just hit ctrl+c to quit escape from the prompt
await atlas.actions.repl.enter()
```

## License

See the [LICENSE](LICENSE) file for information.
