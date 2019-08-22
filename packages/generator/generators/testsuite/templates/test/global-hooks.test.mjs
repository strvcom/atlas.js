import * as sinon from 'sinon'
import atlas from '..'

before(() => atlas.start())
after(() => atlas.stop())

afterEach(() => {
  // Restore all mocks & spies after each test case
  sinon.restore()
})
