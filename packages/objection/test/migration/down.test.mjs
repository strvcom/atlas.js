import Umzug from 'umzug'
import { MigrationAction as Migration } from '../..'

describe('Migration::down()', () => {
  let migration
  let database

  beforeEach(function() {
    this.sandbox.stub(Umzug.prototype, 'down').resolves([])
    database = {
      connection: {},
    }
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
    expect(migration).to.respondTo('down')
  })

  it('undoes the migration', async () => {
    await migration.down()

    expect(Umzug.prototype.down).to.have.callCount(1)
  })

  it('returns the undone migration names', async () => {
    Umzug.prototype.down.callsFake(function() {
      this.emit('reverted', '002-second')

      return Promise.resolve()
    })

    const reverted = await migration.down()

    expect(reverted).to.eql([
      '002-second',
    ])
  })

  it('passes the undo options to the underlying client', async () => {
    const options = {}
    await migration.down(options)

    expect(Umzug.prototype.down).to.have.been.calledWith(options)
  })
})
