import Service from '@atlas.js/service'
import { Service as RapidIO } from '../'

describe('Service: RapidIO', () => {
  it('exists', () => {
    expect(RapidIO).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new RapidIO()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(RapidIO.defaults).to.have.all.keys([
      'apiKey',
      'authToken',
      'withAuthorization',
    ])
  })
})
