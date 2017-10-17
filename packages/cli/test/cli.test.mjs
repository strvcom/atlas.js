import caporal from 'caporal'
import commands from '../src/commands'
import cli from '..'

describe('CLI', () => {
  beforeEach(function() {
    this.sandbox.stub(caporal, 'parse')
    this.sandbox.spy(caporal, 'command')
    this.sandbox.spy(caporal, 'version')
    this.sandbox.spy(caporal, 'description')
  })


  it('exists', () => {
    expect(cli).to.be.a('function')
  })

  it('sets version', () => {
    cli(caporal, '')
    expect(caporal.version).to.have.callCount(1)
  })

  it('sets description', () => {
    cli(caporal, '')
    expect(caporal.description).to.have.callCount(1)
  })

  it('registers all known commands to caporal', () => {
    cli(caporal, '')

    // Sanity check
    expect(commands.length).to.be.greaterThan(0)
    expect(caporal.command).to.have.callCount(commands.length)
  })

  it('parses args given on function input', () => {
    cli(caporal, '--test flag')

    expect(caporal.parse).to.have.callCount(1)
    expect(caporal.parse).to.have.been.calledWith('--test flag')
  })
})
