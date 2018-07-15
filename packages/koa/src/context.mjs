import Hook from '@atlas.js/hook'
import { FrameworkError } from '@atlas.js/errors'

class ContextHook extends Hook {
  static config = {
    type: 'object',
    additionalProperties: false,
    default: {},
    properties: {
      module: {
        type: 'string',
        default: 'koa-context',
      },
    },
  }

  static observes = 'service:koa'
  static requires = [
    'service:koa',
  ]

  afterPrepare() {
    const koa = this.component('service:koa')
    // Prefer default export or a standard CommonJS module
    const context = this.atlas.require(this.config.module, { normalise: true })

    for (const [name, func] of Object.entries(context)) {
      if (name in koa.context) {
        throw new FrameworkError(`Unable to extend koa.context with ${name} - property exists`)
      }

      koa.context[name] = func
    }
  }
}

export default ContextHook
