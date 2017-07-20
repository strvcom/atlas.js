import Hook from '..'

describe('Hook::prepare()', () => {
  let hook

  beforeEach(() => {
    hook = new Hook()
  })


  it('exists', () => {
    expect(hook).to.respondTo('prepare')
  })

  it('saves the config object to itself', () => {
    const config = { test: true }

    // Sanity check
    expect(hook).to.not.have.property('config')

    hook.prepare({ config })
    expect(hook).to.have.property('config', config)
  })
})
