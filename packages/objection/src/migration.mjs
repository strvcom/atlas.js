import * as path from 'path'
import * as Umzug from 'umzug'
import Action from '@atlas.js/action'

class Migration extends Action {
  static config = {
    type: 'object',
    additionalProperties: false,
    default: {},
    properties: {
      module: {
        type: 'string',
        default: 'migration',
      },
    },
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
    storage: 'knex-umzug',
    storageOptions: {
      connection,

    },
    migrations: {
      path: path.resolve(this.atlas.root, this.config.module),
      // Match only filenames without extension (directory with index.js), or plain .js files
      pattern: /^[^.]+(\.js)?$/ui,
      params: [
        connection,
      ],
    },
  })
}

export default Migration
