import Admin from 'firebase-admin'
import { Service as Firebase } from '../..'

describe('Firebase::prepare()', () => {
  let instance
  let fakeFb

  beforeEach(function() {
    fakeFb = {}

    this.sb.each.stub(Admin.credential, 'cert').returns({})
    this.sb.each.stub(Admin, 'initializeApp').returns(fakeFb)

    instance = new Firebase({
      config: {
        name: 'test',
        databaseURL: 'test-url.firebaseio.com',
      },
    })

    return instance.prepare()
  })


  it('exists', () => {
    expect(instance).to.respondTo('prepare')
  })

  it('returns the client created by initializeApp', async () => {
    expect(await instance.prepare()).to.equal(fakeFb)
  })

  it('passes the configuration data to the initializeApp function', async () => {
    await instance.prepare()

    expect(Admin.initializeApp).to.have.been.calledWith({
      credential: {},
      databaseURL: 'test-url.firebaseio.com',
    }, 'test')
  })

  it('loads the credentials from file if the credential is a string', async () => {
    Admin.credential.cert.returnsArg(0)
    instance = new Firebase({
      app: { root: __dirname },
      config: {
        name: 'test',
        credential: 'test-credential.json',
      },
    })

    await instance.prepare()

    const arg = Admin.initializeApp.lastCall.args[0]

    expect(arg.credential).to.be.an('object')
    expect(arg.credential).to.have.all.keys(['desc'])
  })
})
