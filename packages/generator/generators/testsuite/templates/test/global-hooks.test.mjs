import atlas from '..'
import * as sinon from 'sinon'

before(() => atlas.start())
after(() => atlas.stop())

afterEach(() => {
  // Restore all mocks & spies after each test case
  sinon.restore()
})
