import { Atlas } from '..'
import {
  FrameworkError,
  ValidationError,
} from '@atlas.js/errors'
import Service from '@atlas.js/service'

class DummyService extends Service {}

describe('Atlas::service()', () => {
  let atlas
  let options

  beforeEach(() => {
    options = {
      root: __dirname,
      config: {
        services: {
          dummy: {
            test: true,
          },
        },
      },
    }
    atlas = new Atlas(options)
  })

  it('returns this', () => {
    expect(atlas.service('dummy', DummyService)).to.equal(atlas)
  })

  it('throws when the alias has already been used by another service', () => {
    atlas.service('dummy', DummyService)
    expect(() => atlas.service('dummy', DummyService)).to.throw(FrameworkError)
  })

  it('throws when the service is not a class/function', () => {
    expect(() => atlas.service('dummy', {})).to.throw(FrameworkError)
  })

  it('provides the atlas on service constructor argument', () => {
    const service = sinon.spy()
    service.config = {}
    atlas.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args).to.have.property('atlas')
    expect(args.atlas).to.equal(atlas)
  })

  it('provides a logger instance on service constructor argument', () => {
    const service = sinon.spy()
    service.config = {}
    atlas.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args).to.have.property('log')
    expect(args.log).to.be.an('object')
    expect(args.log.chindings).to.match(/"service":"dummy"/u)
  })

  it('provides config object on service constructor argument', () => {
    const service = sinon.spy()
    service.config = {}
    atlas.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args).to.have.property('config')
    expect(args.config).to.be.an('object')
    expect(args.config).to.equal(options.config.services.dummy)
  })

  it('provides the resolve function on service constructor argument as `component`', () => {
    const service = sinon.spy()
    service.config = {}
    atlas.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args).to.have.property('component')
    expect(args.component).to.be.a('function')
  })

  it('applies defaults defined on service on top of user-provided config', () => {
    const service = sinon.spy()
    service.config = {}
    service.defaults = { default: true }
    atlas.service('dummy', service)
    const args = service.getCall(0).args[0]

    expect(args.config).to.have.property('default', true)
  })

  it('throws when aliases do not satisfy requirements of the component', () => {
    const service = sinon.spy()
    service.config = {}
    service.requires = ['service:dummy', 'action:dummy']
    expect(() => {
      atlas.service('dummy', service)
    }).to.throw(FrameworkError, /Missing aliases for component dummy/u)
  })

  it('throws when extraneous aliases are specified', () => {
    const service = sinon.spy()
    expect(() => {
      atlas.service('dummy', service, { aliases: {
        'action:dummy': 'dummy',
      } })
    }).to.throw(FrameworkError, /Unneeded aliases for component dummy/u)
  })

  it('throws when user config fails component config schema', () => {
    options.config.services.dummy = { lol: true }
    atlas = new Atlas(options)

    const service = sinon.spy()
    service.config = {
      type: 'object',
      additionalProperties: false,
      properties: {
        test: { type: 'boolean' },
      },
    }

    expect(() => atlas.service('dummy', service)).to.throw(ValidationError)
  })

  it('works when user config passes component config schema', () => {
    const service = sinon.spy()
    service.config = {
      type: 'object',
      additionalProperties: false,
      properties: {
        test: { type: 'boolean' },
      },
    }

    expect(() => atlas.service('dummy', service)).not.to.throw(ValidationError)
  })

  it('works when all requirements are specified', () => {
    const service = sinon.spy()
    service.config = {}
    service.requires = ['service:dummy', 'action:dummy']
    expect(() => {
      atlas.service('dummy', service, { aliases: {
        'service:dummy': 'dummy',
        'action:dummy': 'dummy',
      } })
    }).to.not.throw()
  })
})
