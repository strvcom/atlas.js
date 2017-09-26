import * as Atlas from '..'

describe('Atlas', () => {
  it('includes the Application class', () => {
    expect(Atlas.Application).to.be.a('function')
  })

  it('includes the Service class', () => {
    expect(Atlas.Service).to.be.a('function')
  })

  it('includes the Hook class', () => {
    expect(Atlas.Hook).to.be.a('function')
  })

  it('includes the errors package', () => {
    expect(Atlas.errors).to.be.an('object')
    expect(Atlas.errors).to.include.keys([
      'FrameworkError',
    ])
  })
})
