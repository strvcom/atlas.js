import Exec from '../../src/commands/exec'

describe('CLI: exec', () => {
  let exec

  beforeEach(() => {
    exec = new Exec()
    exec.atlas = {
      start: sinon.stub(),
      stop: sinon.stub(),
      actions: {
        testaction: {
          testmethod: sinon.stub(),
        },
      },
    }
  })


  it('exists', () => {
    expect(Exec).to.be.a('function')
  })

  it('defines required static properties', () => {
    expect(Exec).to.have.property('command', 'exec')
    expect(Exec).to.have.property('description')
    expect(Exec).to.have.property('args').which.is.an('array')
  })


  describe('.run()', () => {
    it('exists', () => {
      expect(exec).to.respondTo('run')
    })

    it('invokes the function at given action and method', async () => {
      await exec.run({
        action: 'testaction',
        method: 'testmethod',
      })

      expect(exec.atlas.actions.testaction.testmethod).to.have.callCount(1)
    })

    it('starts and stops atlas', async () => {
      await exec.run({
        action: 'testaction',
        method: 'testmethod',
      })

      expect(exec.atlas.start).to.have.callCount(1)
      expect(exec.atlas.stop).to.have.callCount(1)
    })

    it('parses the arguments as JSON and passes them to the action', async () => {
      await exec.run({
        action: 'testaction',
        method: 'testmethod',
        args: [
          JSON.stringify({ first: true }),
          JSON.stringify({ second: true }),
        ],
      })

      expect(exec.atlas.actions.testaction.testmethod).to.have.been.calledWith(
        { first: true },
        { second: true },
      )
    })

    it('does not throw if the arguments are not JSON-parseable', async () => {
      await exec.run({
        action: 'testaction',
        method: 'testmethod',
        args: [
          'string',
          123,
          true,
        ],
      })
    })
  })
})
