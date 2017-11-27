import { Action as Templates } from '../..'
import Action from '@atlas.js/action'

describe('Action: Templates', () => {
  it('exists', () => {
    expect(Templates).to.be.a('function')
  })

  it('extends @atlas.js/action', () => {
    expect(new Templates({ config: { engine: 'pug' } })).to.be.instanceof(Action)
  })

  it('defines its defaults', () => {
    expect(Templates.defaults).to.have.all.keys([
      'templates',
      'engine',
      'extension',
      'locals',
    ])
  })
})
