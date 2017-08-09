import Service from '@atlas.js/service'
import { Service as Nodemailer } from '../..'

describe('Service: Nodemailer', () => {
  it('exists', () => {
    expect(Nodemailer).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Nodemailer()).to.be.instanceof(Service)
  })

  it('defines its defaults', () => {
    expect(Nodemailer.defaults).to.have.all.keys([
      'transport',
      'options',
      'defaults',
      'plugins',
    ])
  })
})
