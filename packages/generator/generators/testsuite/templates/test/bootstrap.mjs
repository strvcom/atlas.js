import * as sinon from 'sinon'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import * as dirtyChai from 'dirty-chai'

// Make sure our tests always run in the 'test' environment
// eslint-disable-next-line no-process-env
process.env.NODE_ENV = 'test'

// Adds syntax like: return doSomethingAsync().should.eventually.equal('foo')
chai.use(chaiAsPromised)
// Converts all property access assertions into function calls:
// expect(true).to.be.ok => expect(true).to.be.ok()
chai.use(dirtyChai)
// Adds sinon-related assertions directly into Chai: expect(mySpy).to.have.been.calledWith('foo')
chai.use(sinonChai)

// Make our lives easier - expose these packages as globals since they are used everywhere in tests
global.expect = chai.expect
global.sinon = sinon
