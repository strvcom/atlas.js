import nodemailer from 'nodemailer'
import { Service as Nodemailer } from '../..'

describe('Nodemailer::stop()', () => {
  let service
  let transport

  beforeEach(function() {
    transport = {
      transporter: { name: 'loltransport' },
      close: sinon.stub(),
    }
    this.sb.each.stub(nodemailer, 'createTransport').returns(transport)

    service = new Nodemailer({
      log: {
        child: sinon.stub(),
      },
      config: {
        transport: () => {},
      },
    })

    return service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('stop')
  })

  it('calls close on the transport instance', async () => {
    await service.stop(transport)

    expect(transport.close).to.have.callCount(1)
  })
})
