import { Atlas, errors } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Service as Queue } from '../..'

describe('Service: Queue', () => {
  it('exists', () => {
    expect(Queue).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Queue()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(Queue.config).to.be.an('object')
  })

  it('throws on invalid config', () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.service('queue', Queue)).to.throw(errors.ValidationError)
  })

  it('does not throw on valid config', () => {
    const atlas = new Atlas({
      root: __dirname,
      config: {
        services: {
          queue: {
            queues: [{ name: 'test' }],
          },
        },
      },
    })

    expect(() =>
      atlas.service('queue', Queue)).not.to.throw()
  })
})
