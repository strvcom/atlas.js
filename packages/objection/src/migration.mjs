import path from 'path'
import Umzug from 'umzug'
import KnexUmzug from 'knex-umzug'
import Action from '@atlas.js/action'

class Migration extends Action {
  static defaults = {
    module: 'migrations',
  }

  static requires = [
    'service:objection',
  ]

  async up(options = {}) {
    const migrator = this::mkmigrator()
    const migrated = []

    migrator.on('migrated', migration => {
      migrated.push(migration)
      this.log.info({ migration }, 'migration:up')
    })

    await migrator.up(options)

    return migrated
  }

  async down(options = {}) {
    const migrator = this::mkmigrator()
    const reverted = []

    migrator.on('reverted', migration => {
      reverted.push(migration)
      this.log.info({ migration }, 'migration:down')
    })

    await migrator.down(options)

    return reverted
  }

  pending() {
    return this::mkmigrator().pending()
  }
}


function mkmigrator() {
  const connection = this.component('service:objection').connection

  return new Umzug({
    storage: KnexUmzug,
    storageOptions: {
      connection,

    },
    migrations: {
      path: path.resolve(this.atlas.root, this.config.module),
      // Match only filenames without extension (directory with index.js), or plain .js files
      pattern: /^[^.]+(\.js)?$/i,
      params: [
        connection,
      ],
    },
  })
}

export default Migration
