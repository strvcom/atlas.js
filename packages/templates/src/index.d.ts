declare module '@atlas.js/templates' {
  import AtlasAction from '@atlas.js/action'

  /**
   * This component allows you to render a wide range of templating languages into the final HTML
   *
   * Under the hood, the [_consolidate.js_](https://github.com/tj/consolidate.js) project is used
   * for the actual rendering, so any template language supported by that project is also supported
   * here.
   */
  class Action extends AtlasAction {
    /** Action runtime configuration values */
    config: Action.Config

    /**
     * Render a template with the specified name into HTML
     *
     * The template name must match the template's filename, relative to the location of the
     * templates directory specified in this component's configuration.
     *
     * @param     template            The template's filename, relative to the templates' directory
     * @param     locals              Optional variables to be provided to the template
     * @return    {Promise<string>}   The rendered HTML string
     */
    render(template: string, locals?: object): Promise<string>
  }

  namespace Action {
    /** Configuration schema available to this action */
    interface Config {
      /**
       * Filesystem location, relative to `atlas.root`, where the templates are located
       * @default   templates
       */
      templates?: string

      /**
       * File extension to look for when resolving template names into actual files
       * @default   .pug
       */
      extension?: string

      /**
       * Templating engine to use
       *
       * @see       https://github.com/tj/consolidate.js for supported languages
       * @default   pug
       */
      engine?: string

      /**
       * Local values to be passed directly to the rendering engine as variable replacements
       */
      locals?: {
        /**
         * Some engines support various caching strategies. Set this to `false` to disable this.
         *
         * @see       https://github.com/tj/consolidate.js#caching
         * @default   true
         */
        cache?: boolean
        [key: string]: any
      }
    }
  }

  export {
    Action,
  }
}
