import Service from '..'

describe('Service::prepare()', () => {
  let service

  beforeEach(() => {
    service = new Service()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('saves the config object to itself', () => {
    const config = { test: true }

    // Sanity check
    expect(service).to.not.have.property('config')
    service.prepare({ config })
    expect(service).to.have.property('config', config)
  })
})
