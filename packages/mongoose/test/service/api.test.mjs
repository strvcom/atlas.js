import Service from '@atlas.js/service'
import { Service as Mongoose } from '../..'

describe('Service: Mongoose', () => {
  it('exists', () => {
    expect(Mongoose).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Mongoose()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(Mongoose.defaults).to.have.all.keys([
      'uri',
      'options',
    ])
  })
})
