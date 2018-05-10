before(function() {
  this.sandbox = sinon.createSandbox()
})

afterEach(function() {
  this.sandbox.restore()
})
