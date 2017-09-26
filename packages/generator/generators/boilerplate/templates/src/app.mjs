/*
 * Atlas.js application instance initialisation
 *
 * Unless you would like to use a different folder structure for your project, you need not modify
 * this file.
 */

import { Application } from '@atlas.js/core'

const app = Application.init({
  // All paths will be relative to this directory
  root: __dirname,
  // Components will be loaded from the following modules. Atlas will try to `require()` these from
  // the module names specified here, relative to root, ie. if __dirname is src/, then src/services
  // must either be a file (src/services.js) or a folder (src/services/index.js).
  services: 'services',
  actions: 'actions',
  hooks: 'hooks',
  config: 'config',
})

export default app
