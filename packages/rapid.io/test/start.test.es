import rapid from 'rapid-io'
import { Service as RapidIO } from '../'

describe('RapidIO::start()', () => {
  let service
  let fakeRapidClient
  const VALID_AUTH_TOKEN = 'rapid-secret'

  beforeEach(function() {
    fakeRapidClient = {
      authorize(authToken, callback) {
        if (authToken === VALID_AUTH_TOKEN) {
          return callback(null)
        }
        const err = new Error('Invalid auth token')
        return callback(err)
      },
    }

    this.sb.each.stub(rapid, 'createClient').returns(fakeRapidClient)

    service = new RapidIO({
      app: {},
      log: {
        info: () => {},
      },
      config: {
        apiKey: 'rapidApiKey',
        authToken: VALID_AUTH_TOKEN,
        withAuthorization: true,
      },
    })

    return service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('start')
  })

  it('should not throw with valid auth token', async () => {
    const rapidClient = await service.prepare()
    expect(rapidClient).to.equal(fakeRapidClient)

    return expect(service.start(rapidClient)).to.be.eventually.fulfilled
  })

  it('should throw with invalid auth token', async () => {
    const rapidClient = await service.prepare()
    service = new RapidIO({
      app: {},
      log: {
        info: () => {},
      },
      config: {
        apiKey: 'rapidApiKey',
        withAuthorization: true,
        authToken: 'invalid',
      },
    })

    return expect(service.start(rapidClient)).to.be.eventually.rejected
  })

  it('should throw with invalid auth token', async () => {
    const rapidClient = await service.prepare()
    service = new RapidIO({
      app: {},
      log: {
        info: () => {},
      },
      config: {
        apiKey: 'rapidApiKey',
        withAuthorization: true,
        authToken: 'invalid',
      },
    })

    return expect(service.start(rapidClient)).to.be.eventually.rejected
  })

  it('should not call authorize on rapid client when "withAuthorization" is set to false',
    async () => {
      service = new RapidIO({
        app: {},
        log: {
          info: () => {},
        },
        config: {
          apiKey: 'rapidApiKey',
          withAuthorization: false,
        },
      })
      fakeRapidClient.authorize = sinon.spy()
      fakeRapidClient.onConnectionStateChanged = callback => {
        fakeRapidClient.connected = true
        setTimeout(callback, 500)
      }

      const rapidClient = await service.prepare()
      await service.start(rapidClient)
      expect(fakeRapidClient.authorize).to.have.callCount(0)
    })

  it('should fail to initialize if connection fails',
    async () => {
      service = new RapidIO({
        app: {},
        log: {
          info: () => {},
        },
        config: {
          apiKey: 'rapidApiKey',
          withAuthorization: false,
        },
      })
      fakeRapidClient.onConnectionStateChanged = callback => {
        fakeRapidClient.connected = false
        setTimeout(callback, 500)
      }

      const rapidClient = await service.prepare()
      return expect(service.start(rapidClient)).to.be.eventually.rejected
    })

  it('should successfully initialize if rapid client is already connected',
    async () => {
      service = new RapidIO({
        app: {},
        log: {
          info: () => {},
        },
        config: {
          apiKey: 'rapidApiKey',
          withAuthorization: false,
        },
      })

      // should fulfill Promise immediately
      fakeRapidClient.connected = true

      const rapidClient = await service.prepare()
      return expect(service.start(rapidClient)).to.be.eventually.fulfilled
    })
})
