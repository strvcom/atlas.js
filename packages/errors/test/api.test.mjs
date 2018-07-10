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

  describe('ValidationError', () => {
    it('exists', () => {
      expect(errors.ValidationError).to.be.a('function')
    })

    it('inherits from FrameworkError', () => {
      expect(new errors.ValidationError()).to.be.instanceOf(errors.FrameworkError)
    })

    it('exposes the constructor argument as this.errors', () => {
      const data = { error: '123' }
      const err = new errors.ValidationError(data)

      expect(err.errors).to.eql(data)
    })

    it('works even if no errors are given to the constructor', () => {
      const err = new errors.ValidationError()

      expect(err.errors).to.be.an('object')
    })
  })
})
