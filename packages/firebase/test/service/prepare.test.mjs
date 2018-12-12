import * as path from 'path'
import * as Admin from 'firebase-admin'
import { Service as Firebase } from '../..'

describe('Firebase::prepare()', () => {
  let service
  let fakeFb

  beforeEach(function() {
    fakeFb = {}

    this.sandbox.stub(Admin.credential, 'cert').returns({})
    this.sandbox.stub(Object.getPrototypeOf(Admin), 'initializeApp').returns(fakeFb)

    service = new Firebase({
      config: {
        name: 'test',
        databaseURL: 'test-url.firebaseio.com',
      },
    })

    return service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns the client created by initializeApp', async () => {
    expect(await service.prepare()).to.equal(fakeFb)
  })

  it('passes the configuration data to the initializeApp function', async () => {
    await service.prepare()

    expect(Admin.initializeApp).to.have.been.calledWith({
      credential: {},
      databaseURL: 'test-url.firebaseio.com',
    }, 'test')
  })

  it('loads the credentials from file if the credential is a string', async () => {
    Admin.credential.cert.returnsArg(0)
    service = new Firebase({
      atlas: {
        root: __dirname,
        // eslint-disable-next-line global-require
        require: location => require(path.resolve(__dirname, location)),
      },
      config: {
        name: 'test',
        credential: 'test-credential.json',
      },
    })

    await service.prepare()

    const arg = Admin.initializeApp.lastCall.args[0]

    expect(arg.credential).to.be.an('object')
    expect(arg.credential).to.have.all.keys(['desc'])
  })
})
