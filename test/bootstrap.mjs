import * as sinon from 'sinon'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'

// Make sure our tests always run in the 'test' environment
// eslint-disable-next-line no-process-env
process.env.NODE_ENV = 'test'

chai.use(chaiAsPromised)
chai.use(sinonChai)

// Make our lives easier - expose these packages as globals since they are used everywhere in tests
global.expect = chai.expect
global.sinon = sinon
