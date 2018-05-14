import { Atlas } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Service as Firebase } from '../..'

describe('Service: Firebase', () => {
  it('exists', () => {
    expect(Firebase).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Firebase()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(Firebase.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() => atlas.service('firebase', Firebase)).to.not.throw()
  })
})
