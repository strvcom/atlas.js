import { Service as Mongoose } from '../..'
import mongoose from 'mongoose'

describe('Mongoose::start()', () => {
  let service
  let instance

  beforeEach(async function() {
    service = new Mongoose({
      app: {},
      log: {},
      config: {},
    })
    instance = await service.prepare()

    this.sandbox.stub(mongoose.Mongoose.prototype, 'connect').resolves()
  })

  it('exists', () => {
    expect(service).to.respondTo('start')
  })

  it('calls connect() on the underlying mongoose client', async () => {
    await service.start(instance)

    expect(mongoose.connect).to.have.callCount(1)
  })

  it('exposes the Atlas instance to the models', async () => {
    // Pretend we have some models...
    instance.model('first', new mongoose.Schema({ test: Boolean }))
    instance.model('second', new mongoose.Schema({ test: Boolean }))

    expect(instance.model('first')).to.not.have.property('atlas')
    expect(instance.model('second')).to.not.have.property('atlas')

    await service.start(instance)

    expect(instance.model('first')).to.have.property('atlas')
    expect(instance.model('second')).to.have.property('atlas')
  })
})
