import path from 'path'
import nodemailer from 'nodemailer'
import { Service as Nodemailer } from '../..'
import dummytransport from './dummytransport'

describe('Nodemailer::prepare()', () => {
  let service
  let transport
  let config

  beforeEach(function() {
    transport = {
      transporter: { name: 'loltransport' },
    }
    config = {
      transport: sinon.stub(),
      options: {
        someval: true,
      },
      defaults: {
        default: true,
      },
    }
    this.sandbox.stub(nodemailer, 'createTransport').returns(transport)

    service = new Nodemailer({
      log: {
        child: sinon.stub(),
      },
      config,
    })
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns the client created by createTransport', async () => {
    expect(await service.prepare()).to.equal(transport)
  })

  it('gives the initialised transporter to createTransport as first arg', async () => {
    const transporter = { transporter: true }
    config.transport.returns(transporter)
    await service.prepare()
    const args = nodemailer.createTransport.lastCall.args

    expect(args[0]).to.equal(transporter)
  })

  it('applies default email options from config.defaults', async () => {
    await service.prepare()
    const args = nodemailer.createTransport.lastCall.args

    expect(args[1]).to.equal(config.defaults)
  })

  it('creates the transport with the config data at options', async () => {
    await service.prepare()

    expect(config.transport).to.have.callCount(1)
    expect(config.transport).to.have.been.calledWith(config.options)
  })

  it('configures and applies plugins defined in config', async () => {
    transport.use = sinon.stub()
    config.plugins = [{
      plugin: sinon.stub(),
      event: 'compile',
      options: {},
    }, {
      plugin: sinon.stub(),
      event: 'stream',
      options: {},
    }, {
      plugin: path.resolve(__dirname, 'dummyplugin'),
      event: 'compile',
      options: {},
    }]
    service = new Nodemailer({
      log: {
        child: sinon.stub(),
      },
      config,
    })

    await service.prepare()

    expect(transport.use).to.have.callCount(config.plugins.length)

    config.plugins.forEach((definition, index) => {
      const call = transport.use.getCall(index)
      expect(call.args[0]).to.equal(definition.event)
      // if the plugin was specified as string, reauire it; otherwise check the function
      const plugin = typeof definition.plugin === 'string'
        // eslint-disable-next-line global-require
        ? require(path.resolve(__dirname, definition.plugin))
        : definition.plugin
      expect(plugin).to.have.callCount(1)
      expect(plugin).to.have.been.calledWith(definition.options)
    })
  })

  it('allows specifying the transport as string which will be required', async () => {
    // Sanity check
    expect(dummytransport).to.have.callCount(0)

    config.transport = path.resolve(__dirname, 'dummytransport')
    service = new Nodemailer({
      log: { child: sinon.stub() },
      config,
    })

    await service.prepare()
    expect(dummytransport).to.have.callCount(1)
    expect(dummytransport).to.have.been.calledWith(config.options)
  })
})
