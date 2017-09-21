# @atlas.js/core

A meta-package containing all the important bits and pieces to start working with @atlas.js right away.

This package includes:

- [`@atlas.js/application`][atlas-application]
- [`@atlas.js/service`][atlas-service]
- [`@atlas.js/hook`][atlas-hook]
- [`@atlas.js/action`][atlas-action]
- [`@atlas.js/errors`][atlas-errors]

## Usage

You can import any of the above components as a named import.

```js
import { Application } from '@atlas.js/core'
import { Service } from '@atlas.js/core'
import { Hook } from '@atlas.js/core'
import { Action } from '@atlas.js/core'
import { errors } from '@atlas.js/core'

// or get it all at once
import * as Atlas from '@atlas.js/core'
```

Full documentation is available in the main [Github repository][atlas-repo].

## License

See the [LICENSE](LICENSE) file for information.

[atlas-application]: https://www.npmjs.com/package/@atlas.js/application
[atlas-service]: https://www.npmjs.com/package/@atlas.js/service
[atlas-hook]: https://www.npmjs.com/package/@atlas.js/hook
[atlas-action]: https://www.npmjs.com/package/@atlas.js/action
[atlas-errors]: https://www.npmjs.com/package/@atlas.js/errors
[atlas-repo]: https://github.com/strvcom/atlas.js
