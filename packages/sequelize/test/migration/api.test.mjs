import { Atlas } from '@atlas.js/atlas'
import Action from '@atlas.js/action'
import { MigrationAction as Migration } from '../..'

describe('Action: MigrationAction', () => {
  it('exists', () => {
    expect(Migration).to.be.a('function')
  })

  it('extends @atlas.js/action', () => {
    expect(new Migration()).to.be.instanceof(Action)
  })

  it('defines its config', () => {
    expect(Migration.config).to.be.an('object')
  })

  it("default config passes component's schema validation", () => {
    const atlas = new Atlas({ root: __dirname })

    expect(() =>
      atlas.action('migration', Migration, {
        aliases: { 'service:sequelize': 'sequelize' },
      })).to.not.throw()
  })

  it('defines its required components', () => {
    expect(Migration.requires).to.eql([
      'service:sequelize',
    ])
  })
})
