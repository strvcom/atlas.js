# @atlas.js/aws

AWS SDK service for @atlas.js.

## Installation

`npm i @atlas.js/aws`

## Usage

```js
import * as aws from '@atlas.js/aws'
import { Application } from '@atlas.js/core'

const app = new Application({
  config: {
    services: {
      myaws: {
        // These options are applied to all services which will be initialised.
        // You can put stuff like `accessKeyId` and `secretAccessKey` or
        // `region` in here.
         globals: {
           accessKeyId: 'my-aws-id',
           secretAccessKey: 'such-secret'
         },

         // For all the keys in this object, the AWS service of that name will
        //  be initialised.
        // The config for each service is passed directly to that service's constructor, so consult the AWS SDK documentation to see what you can use here.
         services: {
           // ie. this will go to `new AWS.S3(/* here */)`
           s3: {
             Bucket: 'so-bucket',
           },
           // These services will be initialised simply because they have a configuration
           // object defined here
           cloudwatch: {},
           lambda: {},
         }
      }
    }
  }
})

app.service('myaws', aws.Service)
await app.start()
// myaws has all the configured services
app.services.myaws.s3
app.services.myaws.cloudwatch
app.services.myaws.lambda
```

## License

See the [LICENSE](LICENSE) file for information.
