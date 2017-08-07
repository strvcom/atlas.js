import { Service as AWS } from '../..'

describe('AWS::stop()', () => {
  let instance

  beforeEach(() => {
    instance = new AWS({
      config: {
        defaults: {},
        services: {},
      },
    })

    return instance.prepare()
  })


  it('exists', () => {
    expect(instance).to.respondTo('stop')
  })

  it('works', () => instance.stop())
})
