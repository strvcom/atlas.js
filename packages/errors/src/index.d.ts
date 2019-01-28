import { ErrorObject } from 'ajv'

export class FrameworkError extends Error { }

export class ValidationError extends FrameworkError {
  constructor(errors: Array<ErrorObject>)

  /** Errors returned by Ajv */
  errors: Array<ErrorObject>
}
