import { Atlas, errors } from '@atlas.js/atlas'
import Service from '@atlas.js/service'
import { Service as Braintree } from '../..'

describe('Service: Braintree', () => {
  it('exists', () => {
    expect(Braintree).to.be.a('function')
  })

  it('extends @atlas.js/service', () => {
    expect(new Braintree()).to.be.instanceof(Service)
  })

  it('defines its config', () => {
    expect(Braintree.config).to.be.an('object')
  })

  it('throws on invalid config', function() {
    const atlas = new Atlas({ root: __dirname })
    this.sandbox.stub(atlas.log, 'error')

    expect(() =>
      atlas.service('braintree', Braintree)).to.throw(errors.ValidationError)
  })

  it('does not throw on valid config', () => {
    const atlas = new Atlas({
      root: __dirname,
      config: {
        services: {
          braintree: {
            merchantId: 'abc',
            publicKey: 'pubkey-test',
            privateKey: 'privkey-test',
          },
        },
      },
    })

    expect(() =>
      atlas.service('braintree', Braintree)).not.to.throw()
  })
})
