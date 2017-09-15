import rapid from 'rapid-io'
import { Service as RapidIO } from '../'

describe('RapidIO::prepare()', () => {
  let service
  let fakeRapidClient

  beforeEach(function() {
    fakeRapidClient = {}

    this.sb.each.stub(rapid, 'createClient').returns(fakeRapidClient)

    service = new RapidIO({
      config: {
        apiKey: 'rapidApiKey',
        authToken: 'rapid-secret',
        withAuthorization: false,
      },
    })

    return service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns the client created by createClient', async () => {
    expect(await service.prepare()).to.equal(fakeRapidClient)
  })

  it('passes the configuration data to the createClient function', async () => {
    await service.prepare()

    expect(rapid.createClient).to.have.been.calledWith('rapidApiKey')
  })
})
