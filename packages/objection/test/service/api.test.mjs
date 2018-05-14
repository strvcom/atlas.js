import { Atlas, errors } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Service as Objection } from '../..'

describe('Service: Objection', () => {
  it('exists', () => {
    expect(Objection).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Objection()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(Objection.config).to.be.an('object')
  })

  it('throws on invalid config', () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.service('objection', Objection)).to.throw(errors.ValidationError)
  })

  it('does not throw on valid config', () => {
    const atlas = new Atlas({
      root: __dirname,
      config: {
        services: {
          objection: {
            knex: {
              client: 'sqlite',
            },
          },
        },
      },
    })

    expect(() =>
      atlas.service('objection', Objection)).not.to.throw()
  })
})
