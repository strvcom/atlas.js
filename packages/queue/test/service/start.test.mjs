import BeeQueue from 'bee-queue'
import { Service as Queue } from '../..'

describe.only('Queue::start()', () => {
  let service
  let instance
  let config

  beforeEach(async () => {
    config = {
      queues: [{
        name: 'testqueue', config: {},
      }, {
        name: 'anotherqueue', config: {},
      }],
    }
    service = new Queue({
      atlas: {},
      log: {},
      config,
    })
    instance = await service.prepare()
    await service.start(instance)
  })

  afterEach(() =>
    service.stop(instance))


  it('exists', () => {
    expect(service).to.respondTo('start')
  })

  it('populates the instance with all the defined queues', () => {
    expect(instance).to.have.all.keys(['testqueue', 'anotherqueue'])
  })
})
