import Service from '@theframework/service'
import { Service as AWS } from '../..'

describe('Service: AWS', () => {
  it('exists', () => {
    expect(AWS).to.be.a('function')
  })

  it('extends @theframework/service', () => {
    expect(new AWS()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(AWS.defaults).to.have.all.keys([
      'globals',
      'services',
    ])
  })
})
