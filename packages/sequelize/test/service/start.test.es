import { Service as Database } from '../..'
import Sequelize from 'sequelize'

describe('Sequelize::start()', () => {
  let service
  let instance

  beforeEach(async function() {
    service = new Database({
      app: {},
      log: {},
      config: {
        uri: 'sqlite://test-db.sqlite',
        options: {},
      },
    })
    instance = await service.prepare()

    this.sb.each.stub(Sequelize.prototype, 'authenticate').resolves()
  })

  afterEach(() =>
    service.stop(instance))


  it('exists', () => {
    expect(service).to.respondTo('start')
  })

  it('calls authenticate() on the underlying Sequelize client', async () => {
    await service.start(instance)

    expect(instance.authenticate).to.have.callCount(1)
  })

  it('exposes the Application instance to the models', async () => {
    // Pretend we have some models...
    instance.models.First = class {}
    instance.models.Second = class {}

    await service.start(instance)


    expect(instance.models.First).to.have.property('atlas')
    expect(instance.models.Second).to.have.property('atlas')
    expect(instance.models.First.prototype).to.have.property('atlas')
    expect(instance.models.Second.prototype).to.have.property('atlas')
  })
})
