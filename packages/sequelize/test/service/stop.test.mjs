import { Service as Database } from '../..'
import Sequelize from 'sequelize'

describe('Sequelize::stop()', () => {
  let service
  let instance

  beforeEach(async function() {
    service = new Database({
      atlas: {},
      log: {},
      config: {
        uri: 'sqlite://test-db.sqlite',
        options: {
          operatorsAliases: {},
        },
      },
    })

    instance = await service.prepare()

    this.sandbox.stub(Sequelize.prototype, 'close').resolves()
  })

  it('exists', () => {
    expect(service).to.respondTo('stop')
  })

  it('calls close() on the underlying sequelize client', async () => {
    await service.stop(instance)

    expect(instance.close).to.have.callCount(1)
  })
})
