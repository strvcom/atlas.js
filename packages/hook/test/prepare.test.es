import Hook from '..'

describe('Hook::prepare()', () => {
  let hook

  beforeEach(() => {
    hook = new Hook()
  })


  it('exists', () => {
    expect(hook).to.respondTo('prepare')
  })
})
