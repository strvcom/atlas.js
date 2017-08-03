import Service from '..'

describe('Service::prepare()', () => {
  let service

  beforeEach(() => {
    service = new Service()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })
})
