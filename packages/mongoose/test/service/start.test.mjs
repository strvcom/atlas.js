import * as mongoose from 'mongoose'
import { Service as Mongoose } from '../..'

describe('Mongoose::start()', () => {
  let service
  let instance

  beforeEach(async function() {
    service = new Mongoose({
      atlas: {},
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

    const First = instance.model('first')
    const Second = instance.model('second')

    expect(First).to.not.have.property('atlas')
    expect(Second).to.not.have.property('atlas')
    expect(new First()).to.not.have.property('atlas')
    expect(new Second()).to.not.have.property('atlas')

    await service.start(instance)

    expect(First).to.have.property('atlas')
    expect(Second).to.have.property('atlas')
    expect(new First()).to.have.property('atlas')
    expect(new Second()).to.have.property('atlas')
  })
})
