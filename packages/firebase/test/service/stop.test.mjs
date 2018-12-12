import * as Admin from 'firebase-admin'
import { Service as Firebase } from '../..'

let service
let fakeFb

describe('Firebase::stop()', () => {
  beforeEach(function() {
    fakeFb = {
      delete: sinon.spy(),
    }

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
    expect(service).to.respondTo('stop')
  })

  it('calls delete on the firebase instance', async () => {
    await service.stop(fakeFb)

    expect(fakeFb.delete).to.have.callCount(1)
  })
})
