import pino from 'pino'

const stdSerializers = {
  err: pino.stdSerializers.err,
  req: pino.stdSerializers.req,
  res: pino.stdSerializers.res,
}

export default {
  ...stdSerializers,
  custom: () => {},
}
