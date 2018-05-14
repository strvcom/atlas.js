import { Atlas, errors } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Service as Nodemailer } from '../..'

describe('Service: Nodemailer', () => {
  it('exists', () => {
    expect(Nodemailer).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Nodemailer()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(Nodemailer.config).to.be.an('object')
  })

  it('throws on invalid config', () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.service('nodemailer', Nodemailer)).to.throw(errors.ValidationError)
  })

  it('does not throw on valid config', () => {
    const atlas = new Atlas({
      root: __dirname,
      config: {
        services: {
          nodemailer: {
            transport: 'test',
          },
        },
      },
    })

    expect(() =>
      atlas.service('nodemailer', Nodemailer)).not.to.throw()
  })
})
