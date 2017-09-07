import path from 'path'
import Umzug from 'umzug'
import Action from '@atlas.js/action'
import { DataTypes } from '.'

class Migration extends Action {
  static defaults = {
    module: 'migrations',
  }

  static requires = [
    'service:sequelize',
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
  const sequelize = this.component('service:sequelize')

  return new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    migrations: {
      path: path.resolve(this.app.root, this.config.module),
      // Match only filenames without extension (directory with index.js), or plain .js files
      pattern: /^[^.]+(\.js)?$/i,
      params: [
        sequelize.queryInterface,
        DataTypes,
      ],
    },
  })
}

export default Migration
