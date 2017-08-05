import nodemailer from 'nodemailer'
import { Service as Nodemailer } from '../..'

describe('Nodemailer::stop()', () => {
  let instance
  let transport

  beforeEach(function() {
    transport = {
      transporter: { name: 'loltransport' },
      close: sinon.stub(),
    }
    this.sb.each.stub(nodemailer, 'createTransport').returns(transport)

    instance = new Nodemailer({
      log: {
        child: sinon.stub(),
      },
      config: {
        transport: () => {},
      },
    })

    return instance.prepare()
  })


  it('exists', () => {
    expect(instance).to.respondTo('stop')
  })

  it('calls close on the transport instance', async () => {
    await instance.stop()

    expect(transport.close).to.have.callCount(1)
  })
})
