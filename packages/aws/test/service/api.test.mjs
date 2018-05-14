import { Atlas } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Service as AWS } from '../..'

describe('Service: AWS', () => {
  it('exists', () => {
    expect(AWS).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new AWS()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(AWS.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() => atlas.service('aws', AWS)).to.not.throw()
  })
})
