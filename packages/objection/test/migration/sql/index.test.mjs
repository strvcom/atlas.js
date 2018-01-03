import { MigrationAction as Migration } from '../../..'
import Umzug from 'umzug'

describe.only('Migration: Raw SQL migration', () => {
  let connection
  let migration

  beforeEach(function() {
    this.sandbox.stub(Umzug.prototype, 'executed').returns([])
    // this.sandbox.stub(Umzug.prototype, 'pending').resolves('001-first')
    connection = {
      raw: sinon.stub(),
    }
    migration = new Migration({
      atlas: {
        root: __dirname,
      },
      log: {
        info: () => {},
      },
      config: {
        module: 'migrations',
      },
      component() { return { connection } },
    })
  })


  it('runs raw SQL migrations from the migrations folder', async () => {
    await migration.up()

    expect(connection.raw).to.have.callCount(1)
  })
})
