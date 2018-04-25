import { FrameworkError } from '@atlas.js/errors'
import { Action as Templates } from '../..'

describe('Templates::render()', () => {
  let action
  let config

  beforeEach(() => {
    config = {
      extension: '.pug',
      engine: 'pug',
      templates: 'templates',
    }
    action = new Templates({
      atlas: { root: __dirname },
      config,
    })
  })


  it('exists', () => {
    expect(action).to.respondTo('render')
  })

  it('throws when the specified template engine is invalid', () => {
    expect(() => new Templates({ engine: 'lolengine' })).to.throw(FrameworkError)
  })

  it('renders the template at given path relative to templates dir into html', async () => {
    const html = await action.render('sample', { message: 'hello world' })
    expect(html).to.equal('<html><p>hello world</p></html>')
  })

  it('allows defining per-action locals, or "global" locals 😎', async () => {
    config.locals = {
      message: 'Global hello world',
    }
    action = new Templates({
      atlas: { root: __dirname },
      config,
    })

    const html = await action.render('sample', {})
    expect(html).to.equal('<html><p>Global hello world</p></html>')
  })

  it('locally-specified template vars override globals with the same name', async () => {
    config.locals = {
      message: 'Global hello world',
    }
    action = new Templates({
      atlas: { root: __dirname },
      config,
    })

    const html = await action.render('sample', { message: 'Local hello world' })
    expect(html).to.equal('<html><p>Local hello world</p></html>')
  })

  it('can handle unspecified locals', async () => {
    expect(await action.render('sample')).to.equal('<html><p></p></html>')
  })
})
