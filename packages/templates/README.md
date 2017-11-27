# @atlas.js/templates

This package contains an action which allows rendering a template language into the resulting html string. This is ideal for rendering email templates or simple web views into final html.

The rendering is done using [consolidate.js][consolidate-npm-home] - all template languages listed there are supported by this action - you only need to install the template package you wish to use.

## Usage

> Make sure you install the template package you want to use.

```js
import { Atlas } from '@atlas.js/atlas'
import { Action as Templates } from '@atlas.js/templates'

const atlas = new Atlas({
  config: {
    actions: {
      templates: {
        engine: 'pug',
        templates: 'path/to/templates',
        ext: '.pug',
      },
    },
  },
})
atlas.action('templates', Templates)
await atlas.start()

// Render a template file located in the folder you specified via `templates` in the config and use
// the second argument as the locals for the template
const html = await atlas.actions.templates.render('password-reset', { user: 'abc', code: '123456' })
```

## License

See the [LICENSE](LICENSE) file for information.

[consolidate-npm-home]: https://www.npmjs.com/package/consolidate
