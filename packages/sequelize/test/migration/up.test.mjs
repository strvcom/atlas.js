import Umzug from 'umzug'
import { MigrationAction as Migration } from '../..'
import mksequelizemock from './sequelizemock'

describe('Migration::up()', () => {
  let migration
  let database

  beforeEach(function() {
    this.sandbox.stub(Umzug.prototype, 'up').resolves([])
    database = mksequelizemock()
    migration = new Migration({
      atlas: {
        root: __dirname,
      },
      log: {
        info: () => {},
      },
      config: {
        module: 'testmigrations',
      },
      component() { return database },
    })
  })


  it('exists', () => {
    expect(migration).to.respondTo('up')
  })

  it('runs the migrations', async () => {
    await migration.up()

    expect(Umzug.prototype.up).to.have.callCount(1)
  })

  it('returns the applied migration names', async () => {
    Umzug.prototype.up.callsFake(function() {
      this.emit('migrated', '001-first')
      this.emit('migrated', '002-second')

      return Promise.resolve()
    })

    const migrated = await migration.up()

    expect(migrated).to.eql([
      '001-first',
      '002-second',
    ])
  })

  it('passes the migration options to the underlying client', async () => {
    const options = {}
    await migration.up(options)

    expect(Umzug.prototype.up).to.have.been.calledWith(options)
  })
})
