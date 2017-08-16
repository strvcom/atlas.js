import Service from '@atlas.js/service'
import { Service as Koa } from '../..'

describe('Service: Koa', () => {
  it('exists', () => {
    expect(Koa).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Koa()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(Koa.defaults).to.have.all.keys([
      'listen',
      'server',
      'koa',
    ])
  })
})
