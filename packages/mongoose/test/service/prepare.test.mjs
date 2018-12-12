import * as mongoose from 'mongoose'
import { Service as Mongoose } from '../..'

describe('Mongoose::prepare()', () => {
  let service
  let instance

  beforeEach(async () => {
    service = new Mongoose({
      atlas: {},
      log: {
        trace: sinon.stub(),
      },
      config: {},
    })

    instance = await service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns mongoose instance', async () => {
    expect(await service.prepare()).to.be.instanceof(mongoose.Mongoose)
  })

  it('sets a debug function to log model events', async () => {
    await service.prepare()

    expect(instance.options.debug).to.be.a('function')

    instance.options.debug('collection', 'method', 'arg1', 'arg2')

    expect(service.log.trace).to.have.callCount(1)
    expect(service.log.trace).to.have.been.calledWith({
      collection: 'collection',
      method: 'method',
      args: ['arg1', 'arg2'],
    })
  })
})
