import Service from '@theframework/service'
import { Service as Firebase } from '../..'

describe('Service: Firebase', () => {
  it('exists', () => {
    expect(Firebase).to.be.a('function')
  })

  it('extends @theframework/service', () => {
    expect(new Firebase()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(Firebase.defaults).to.have.all.keys([
      'name',
      'credential',
      'databaseURL',
    ])
  })
})
