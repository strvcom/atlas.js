import { expect } from 'chai'
import { Service } from '..'

describe('Component: noop', () => {
  it('exists', () => {
    expect(Service).to.be.a('function')
  })
})
