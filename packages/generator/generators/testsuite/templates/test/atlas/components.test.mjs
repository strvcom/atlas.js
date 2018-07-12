import atlas from '../..'

describe('Atlas: components', () => {
  it('has all services', () => {
    expect(atlas.services).to.have.all.keys([
      'noop',
    ])
  })

  it('has all actions', () => {
    expect(atlas.actions).to.be.empty()
  })
})
