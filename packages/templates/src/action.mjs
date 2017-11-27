import path from 'path'
import consolidate from 'consolidate'
import Action from '@atlas.js/action'
import { FrameworkError } from '@atlas.js/errors'

export default class Templates extends Action {
  static defaults = {
    // Templates directory
    templates: 'templates',
    // Expected template extension
    extension: '.pug',
    engine: 'pug',
    // Default locals to be sent to the template renderer
    locals: {
      cache: true,
    },
  }

  constructor(...args) {
    super(...args)

    if (!Object.keys(consolidate).includes(this.config.engine)) {
      throw new FrameworkError(`Invalid template engine: ${this.config.engine}`)
    }
  }

  /**
   * Render a template into HTML
   *
   * @param     {String}    name            The template's name. This is the relative path to the
   *                                        template's location in the `templates` directory,
   *                                        without file extension
   * @param     {Object}    [locals={}]     Locals to be sent to the template engine
   * @return    {Promise<String>}           The rendered HTML string
   */
  render(name, locals = {}) {
    // Location of the template on filesystem, relative to Atlas root and templates directories
    const location = path.resolve(
      this.atlas.root,
      this.config.templates,
      path.format({ name, ext: this.config.extension }),
    )
    locals = {
      ...this.config.locals,
      ...locals,
    }

    return consolidate[this.config.engine](location, locals)
  }
}
