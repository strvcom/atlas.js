import Admin from 'firebase-admin'
import { Service as Firebase } from '../..'

let instance
let fakeFb

describe('Firebase::stop()', () => {
  beforeEach(function() {
    fakeFb = {
      delete: sinon.spy(),
    }

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
    expect(instance).to.respondTo('stop')
  })

  it('calls delete on the firebase instance', async () => {
    await instance.stop()

    expect(fakeFb.delete).to.have.callCount(1)
  })
})
