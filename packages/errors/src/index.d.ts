import { ErrorObject } from 'ajv'

export class FrameworkError extends Error {
  constructor(message: string, context: object)

  /** Additional context object providing more information about what caused this error */
  context: object
}

export class ValidationError extends FrameworkError {
  constructor(errors: Array<ErrorObject>, context: object)

  /** Errors returned by Ajv */
  errors: Array<ErrorObject>
}
