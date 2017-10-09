import { Service as Braintree } from '../..'
import * as braintree from 'braintree'

describe('Braintree::prepare()', () => {
  let service
  let instance
  let config

  beforeEach(async () => {
    config = {
      environment: braintree.Environment.Development,
      publicKey: 'dummy-pubkey',
      privateKey: 'dummy-privkey',
      merchantId: 'dummy-id',
    }
    service = new Braintree({
      atlas: {},
      log: {},
      config,
    })

    instance = await service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns braintree client', () => {
    expect(instance).to.have.property('transaction')
    expect(instance.transaction).to.respondTo('sale')
  })

  it('passes the configuration to the braintree.connect() method', async () => {
    let triggered = false

    service = new Braintree({
      atlas: {},
      log: {},
      get config() {
        triggered = true
        return config
      },
    })

    await service.prepare()

    // @TODO: I don't like it, Atlas might be triggering this access when merging in defaults!
    expect(triggered).to.equal(true)
  })
})
