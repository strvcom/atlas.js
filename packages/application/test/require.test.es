import Application from '..'
import * as democonfig from './democonfig'

describe('Application::require()', () => {
  let app

  beforeEach(() => {
    app = new Application({ root: __dirname })
  })


  it('exists', () => {
    expect(app).to.respondTo('require')
  })

  it('requires a module relative to the root', () => {
    const config = app.require('democonfig')

    expect(config).to.equal(democonfig)
  })

  it('throws if the module does not exist', () => {
    expect(() => app.require('lolmodule')).to.throw(/Cannot find module/)
  })


  describe('optional: true', () => {
    it('does not throw', () => {
      expect(() => app.require('lolmodule', { optional: true })).to.not.throw()
    })

    it('returns empty object', () => {
      const contents = app.require('lolmodule', { optional: true })

      expect(contents).to.be.an('object')
      expect(Object.keys(contents)).to.have.length(0)
    })
  })
})
