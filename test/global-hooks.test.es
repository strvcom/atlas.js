const sandbox = sinon.sandbox.create()

beforeEach(function() {
  this.sandbox = sandbox
})

afterEach(() => {
  sandbox.restore()
})
