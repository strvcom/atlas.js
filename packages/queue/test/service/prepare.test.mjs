import { Service as Queue } from '../..'

describe.only('Queue::prepare()', () => {
  let service
  let instance

  beforeEach(async () => {
    service = new Queue({
      atlas: {},
      log: {},
      config: {
        queues: [],
      },
    })

    instance = await service.prepare()
  })

  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns an empty object where queues would be published during startup', () => {
    expect(instance).to.be.an('object')
    expect(Object.keys(instance)).to.have.length(0)
  })
})
