import * as errors from '..'

describe('Errors', () => {
  describe('FrameworkError', () => {
    it('exists', () => {
      expect(errors.FrameworkError).to.be.a('function')
    })

    it('inherits from Error', () => {
      expect(new errors.FrameworkError()).to.be.instanceOf(Error)
    })
  })
})
