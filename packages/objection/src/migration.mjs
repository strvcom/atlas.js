import fs from 'fs'
import path from 'path'
import Umzug from 'umzug'
import Action from '@atlas.js/action'
import util from 'util'

const readfile = util.promisify(fs.readFile)

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
    storage: 'knex-umzug',
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
      customResolver: sqlPathToMigration,
    },
  })
}

function sqlPathToMigration(sqlpath) {
  if (fs.stat(sqlpath).isDirectory()) {
    // This migration is a directory. If it contains up.sql and down.sql, let's load those two files
    // and execute them as either up or down migrations.
    // eslint-disable-next-line no-sync
    const files = fs.readdirSync(sqlpath)

    if (files.includes('up.sql') && files.includes('down.sql')) {
      return sqlmigration(sqlpath)
    }
  }

  // This migration is either a plain .js file or a directory but it does not contain raw SQL files.
  // Fall back to standard CommonJS resolution mechanism for the given sqlpath.
  // eslint-disable-next-line global-require
  return require(sqlpath)
}

function sqlmigration(sqlpath) {
  return {
    async up(knex) {
      return knex.raw(await readfile(path.resolve(sqlpath, 'up.sql'), 'utf8'))
    },
    async down(knex) {
      return knex.raw(await readfile(path.resolve(sqlpath, 'down.sql'), 'utf8'))
    },
  }
}

export default Migration
