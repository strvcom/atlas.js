import { Atlas } from '@atlas.js/atlas'
import Action from '@atlas.js/action'
import { Action as Templates } from '../..'

describe('Action: Templates', () => {
  it('exists', () => {
    expect(Templates).to.be.a('function')
  })

  it('extends @atlas.js/action', () => {
    expect(new Templates({ config: { engine: 'pug' } })).to.be.instanceof(Action)
  })

  it('defines its config', () => {
    expect(Templates.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.service('templates', Templates)).to.not.throw()
  })
})
