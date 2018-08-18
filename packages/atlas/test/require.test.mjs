import { Atlas } from '..'
import * as democonfig from './democonfig'

describe('Atlas::require()', () => {
  let atlas

  beforeEach(() => {
    atlas = new Atlas({ root: __dirname })
  })


  it('exists', () => {
    expect(atlas).to.respondTo('require')
  })

  it('requires a module relative to the root', () => {
    const config = atlas.require('democonfig')

    expect(config).to.equal(democonfig)
  })

  it('throws if the module does not exist', () => {
    expect(() => atlas.require('lolmodule')).to.throw(/Cannot find module/u)
  })


  describe('optional: true', () => {
    it('does not throw', () => {
      expect(() => atlas.require('lolmodule', { optional: true })).to.not.throw()
    })

    it('returns empty object', () => {
      const contents = atlas.require('lolmodule', { optional: true })

      expect(contents).to.be.an('object')
      expect(Object.keys(contents)).to.have.length(0)
    })
  })


  describe('absolute: true', () => {
    it('loads the module from node_modules', () => {
      const contents = atlas.require('chai', { absolute: true })

      expect(contents).to.be.an('object')
    })
  })


  describe('normalise: true', () => {
    it('returns the `default` export if it exists', () => {
      const contents = atlas.require('democonfig/mixed-exports', { normalise: true })

      expect(contents).to.have.property('default', true)
    })

    it('returns the named exports if `default` export does not exist', () => {
      const contents = atlas.require('democonfig', { normalise: true })

      expect(contents).to.have.property('atlas')
      expect(contents.atlas).to.be.an('object')
    })
  })
})
