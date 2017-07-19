import { Action as Repl } from '..'
import Action from '@strv/action'

describe('Action: Repl', () => {
  it('exists', () => {
    expect(Action).to.be.a('function')
  })

  it('extends framework.Action', () => {
    expect(new Repl()).to.be.instanceof(Action)
  })

  it('defines its defaults', () => {
    expect(Repl.defaults).to.have.all.keys([
      'historyFile',
      'username',
      'prompt',
    ])
  })
})
