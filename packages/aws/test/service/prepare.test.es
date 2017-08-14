import awssdk from 'aws-sdk'
import { Service as AWS } from '../..'

describe('AWS::prepare()', () => {
  let service

  beforeEach(() => {
    service = new AWS({
      config: {
        globals: {},
        services: {},
      },
    })

    return service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('creates a service instance for all services configured in the services config', async () => {
    service = new AWS({
      config: {
        services: {
          s3: {},
          cloudWatchLogs: {},
          lambda: {},
        },
      },
    })

    const api = await service.prepare()

    expect(api.s3).to.be.instanceof(awssdk.S3)
    expect(api.cloudWatchLogs).to.be.instanceof(awssdk.CloudWatchLogs)
    expect(api.lambda).to.be.instanceof(awssdk.Lambda)
  })

  it('applies global config to all service configurations', async () => {
    service = new AWS({
      config: {
        globals: {
          testprop: 'test',
        },
        services: {
          s3: { another: 'test' },
        },
      },
    })

    const api = await service.prepare()
    const config = api.s3.config

    expect(config.testprop).to.equal('test')
    expect(config.another).to.equal('test')
  })
})
