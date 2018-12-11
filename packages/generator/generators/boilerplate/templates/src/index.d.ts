/**
 * Project declaration for Atlas
 *
 * This type declaration file allows you to add proper type hints in your editor to this Atlas
 * instance. It adds some extra manual work, but the benefits are quite spectacular once your editor
 * starts showing up autocomplete suggestions in places where you would never expect them. ❤
 */

import { Atlas } from '@atlas.js/atlas'
// Example how to get type data for a core Atlas component
// import { Server, Koa } from '@atlas.js/koa'

declare const atlas: Atlas
export default atlas

declare module '@atlas.js/atlas' {
  class Atlas {
    /** Configuration used throughout this Atlas instance */
    readonly config: {
      atlas: Atlas.Config,

      /** Configuration for services */
      services: {
        // http: Server.Config
      }

      /** Configuration for actions */
      actions: {}

      /** Configuration for hooks */
      hooks: {}
    }

    /**
     * Services added to this Atlas instance
     *
     * @see   src/services/index.mjs
    */
    readonly services: {
      // http: Koa
    }

    /**
     * Actions added to this Atlas instance
     *
     * @see   src/actions/index.mjs
     */
    readonly actions: {}
  }
}
