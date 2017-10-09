# @atlas.js/atlas

The core of Atlas.js. This package contains all the important bits and pieces to start working with @atlas.js right away.

This package includes:

- The main `Atlas` class
- [`@atlas.js/service`][atlas-service]
- [`@atlas.js/hook`][atlas-hook]
- [`@atlas.js/action`][atlas-action]
- [`@atlas.js/errors`][atlas-errors]

## Usage

You can import any of the above components as a named import.

```js
import { Atlas } from '@atlas.js/atlas'
import { Service } from '@atlas.js/atlas'
import { Hook } from '@atlas.js/atlas'
import { Action } from '@atlas.js/atlas'
import { errors } from '@atlas.js/atlas'

// or get it all at once
import * as atlas from '@atlas.js/atlas'
```

Full documentation is available in the main [Github repository][atlas-repo].

## License

See the [LICENSE](LICENSE) file for information.

[atlas-service]: https://www.npmjs.com/package/@atlas.js/service
[atlas-hook]: https://www.npmjs.com/package/@atlas.js/hook
[atlas-action]: https://www.npmjs.com/package/@atlas.js/action
[atlas-errors]: https://www.npmjs.com/package/@atlas.js/errors
[atlas-repo]: https://github.com/strvcom/atlas.js
