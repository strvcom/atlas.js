// Expose default sinon sandboxes in tests so we do not need to create them in every test suite
const sandboxes = Object.freeze({
  each: sinon.sandbox.create(),
  global: sinon.sandbox.create(),
})

beforeEach(function() {
  this.sb = sandboxes
})

afterEach(() => {
  sandboxes.each.restore()
})

after(() => {
  sandboxes.global.restore()
})
