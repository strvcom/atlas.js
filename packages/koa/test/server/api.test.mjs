import { Atlas } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Server as Koa } from '../..'

describe('Service: Koa', () => {
  it('exists', () => {
    expect(Koa).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Koa()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(Koa.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.service('koa', Koa)).to.not.throw()
  })
})
