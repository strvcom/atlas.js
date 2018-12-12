import * as Sequelize from 'sequelize'
import { Service as Database } from '../..'

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

    this.sandbox.spy(Sequelize.prototype, 'close')
  })

  it('exists', () => {
    expect(service).to.respondTo('stop')
    return service.stop(instance)
  })

  it('calls close() on the underlying sequelize client', async () => {
    await service.stop(instance)

    expect(instance.close).to.have.callCount(1)
  })
})
