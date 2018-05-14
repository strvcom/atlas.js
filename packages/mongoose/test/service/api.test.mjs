import { Atlas } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Service as Mongoose } from '../..'

describe('Service: Mongoose', () => {
  it('exists', () => {
    expect(Mongoose).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Mongoose()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(Mongoose.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.service('db', Mongoose)).to.not.throw()
  })
})
