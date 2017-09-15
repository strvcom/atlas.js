import rapid from 'rapid-io'
import { Service as RapidIO } from '../'

let service
let fakeRapidClient

describe('RapidIO::stop()', () => {
  beforeEach(function() {
    fakeRapidClient = {
      disconnect: sinon.stub().callsFake(() => {
        fakeRapidClient.connected = false
      }),
      connected: true,
      onConnectionStateChanged: () => {},
    }

    this.sb.each.stub(rapid, 'createClient').returns(fakeRapidClient)

    service = new RapidIO({
      config: {
        apiKey: 'rapidApiKey',
        withAuthorization: false,
      },
    })

    return service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('stop')
  })

  it('calls disconnect on the rapid client instance', async () => {
    await service.stop(fakeRapidClient)

    expect(fakeRapidClient.disconnect).to.have.callCount(1)
  })

  it('successfully stops Rapid service', () => expect(service.stop(fakeRapidClient)).to.eventually.be.fulfilled)

})
