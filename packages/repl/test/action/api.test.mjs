import { Action as Repl } from '../..'
import Action from '@atlas.js/action'

describe('Action: Repl', () => {
  it('exists', () => {
    expect(Repl).to.be.a('function')
  })

  it('extends @atlas.js/action', () => {
    expect(new Repl()).to.be.instanceof(Action)
  })

  it('defines its defaults', () => {
    expect(Repl.defaults).to.have.all.keys([
      'historyFile',
      'username',
      'prompt',
      'newlines',
      'greet',
    ])
  })
})
