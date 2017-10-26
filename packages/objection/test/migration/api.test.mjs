import Action from '@atlas.js/action'
import { MigrationAction as Migration } from '../..'

describe('Action: MigrationAction', () => {
  it('exists', () => {
    expect(Migration).to.be.a('function')
  })

  it('extends @atlas.js/action', () => {
    expect(new Migration()).to.be.instanceof(Action)
  })

  it('defines its defaults', () => {
    expect(Migration.defaults).to.have.all.keys([
      'module',
    ])
  })

  it('defines its required components', () => {
    expect(Migration.requires).to.eql([
      'service:objection',
    ])
  })
})
