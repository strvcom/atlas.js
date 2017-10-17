import path from 'path'
import Command from '../../src/command'

describe('CLI: Command', () => {
  let cmd

  beforeEach(() => {
    cmd = {
      help: sinon.stub(),
      argument: sinon.stub(),
      option: sinon.stub(),
    }
  })


  it('exists', () => {
    expect(Command).to.be.a('function')
  })

  it('declares static variables', () => {
    expect(Command).to.have.property('args').which.is.an('array')
    expect(Command).to.have.property('options').which.is.an('array')
  })

  it('implements static methods', () => {
    expect(Command).itself.to.respondTo('mkhelp')
    expect(Command).itself.to.respondTo('mkargs')
    expect(Command).itself.to.respondTo('mkoptions')
  })

  it('implements instance methods', () => {
    expect(new Command()).to.respondTo('prerun')
  })


  describe('.mkhelp()', () => {
    it('prefers Command.help to generate the help text', () => {
      class WithHelp extends Command {
        static help = 'help'
        static description = 'description'
      }

      WithHelp.mkhelp(cmd)
      expect(cmd.help).to.have.been.calledWith(WithHelp.help)
    })

    it('uses Command.description if help is not available', () => {
      class WithoutHelp extends Command {
        static description = 'description'
      }

      WithoutHelp.mkhelp(cmd)
      expect(cmd.help).to.have.been.calledWith(WithoutHelp.description)
    })
  })


  describe('.mkargs()', () => {
    it('registers all declared arguments', () => {
      class WithArgs extends Command {
        static args = [
          ['<test>', 'Test description'],
          ['<some>', 'Some description'],
        ]
      }

      WithArgs.mkargs(cmd)
      expect(cmd.argument).to.have.callCount(WithArgs.args.length)

      WithArgs.args.forEach((args, index) => {
        expect(cmd.argument.getCall(index).args).to.eql(args)
      })
    })
  })


  describe('.mkoptions()', () => {
    it('registers all declared options together with global options', () => {
      class WithOpts extends Command {
        static options = [
          ['--test', 'Test description'],
          ['--some', 'Some description'],
        ]
      }

      WithOpts.mkoptions(cmd)
      // Sanity check
      expect(WithOpts.options.length).to.be.greaterThan(0)
      expect(Command.options.length).to.be.greaterThan(0)

      expect(cmd.option).to.have.callCount(WithOpts.options.length + Command.options.length)

      const options = [
        ...WithOpts.options,
        ...Command.options,
      ]

      options.forEach((args, index) => {
        expect(cmd.option.getCall(index).args).to.eql(args)
      })
    })
  })


  describe('.prerun()', () => {
    it('requires the module at given --root and exposes it via this.atlas', () => {
      const command = new Command()
      const mocks = {
        /* eslint-disable global-require */
        module: require('./atlas-stub-module').default,
        script: require('./atlas-stub-script'),
        /* eslint-enable global-require */
      }

      // Atlas instance exported as default ES module
      command.prerun(null, {
        root: path.resolve(__dirname, 'atlas-stub-module'),
      })
      expect(command.atlas).to.equal(mocks.module)

      // Atlas instance exported as classic commonJS export
      command.prerun(null, {
        root: path.resolve(__dirname, 'atlas-stub-script'),
      })
      expect(command.atlas).to.equal(mocks.script)
    })
  })
})
