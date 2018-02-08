import { stdSerializers } from 'pino'

export default {
  ...stdSerializers,
  custom: () => {},
}
