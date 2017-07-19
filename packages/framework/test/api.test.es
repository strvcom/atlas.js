import * as framework from '..'

describe('Framework', () => {
  it('includes the Application class', () => {
    expect(framework.Application).to.be.a('function')
  })

  it('includes the Service class', () => {
    expect(framework.Service).to.be.a('function')
  })

  it('includes the errors package', () => {
    expect(framework.errors).to.be.an('object')
    expect(framework.errors).to.include.keys([
      'FrameworkError',
    ])
  })
})
