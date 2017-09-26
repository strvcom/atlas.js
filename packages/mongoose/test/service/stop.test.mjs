import { Service as Mongoose } from '../..'

describe('Mongoose::stop()', () => {
  let service
  let instance

  beforeEach(async function() {
    service = new Mongoose({
      app: {},
      log: {},
      config: {},
    })

    instance = await service.prepare()

    this.sandbox.stub(Object.getPrototypeOf(instance), 'disconnect').resolves()
  })

  it('exists', () => {
    expect(service).to.respondTo('stop')
  })

  it('calls disconnect() on the underlying mongoose client', async () => {
    await service.stop(instance)

    expect(instance.disconnect).to.have.callCount(1)
  })
})
