import Service from '@theframework/service'
import { Service as Koa } from '../..'

describe('Service: Koa', () => {
  it('exists', () => {
    expect(Koa).to.be.a('function')
  })

  it('extends @theframework/service', () => {
    expect(new Koa()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(Koa.defaults).to.have.all.keys([
      'server',
      'http',
      'koa',
    ])
  })
})
