import { Atlas } from '@atlas.js/atlas'
import Action from '@atlas.js/action'
import { Action as Repl } from '../..'

describe('Action: Repl', () => {
  it('exists', () => {
    expect(Repl).to.be.a('function')
  })

  it('extends @atlas.js/action', () => {
    expect(new Repl()).to.be.instanceof(Action)
  })

  it('defines its config', () => {
    expect(Repl.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.service('repl', Repl)).to.not.throw()
  })
})
