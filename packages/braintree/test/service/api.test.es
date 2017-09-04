import Service from '@atlas.js/service'
import { Service as Braintree } from '../..'

describe('Service: Braintree', () => {
  it('exists', () => {
    expect(Braintree).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Braintree()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(Object.keys(Braintree.defaults)).to.have.length(0)
  })
})
