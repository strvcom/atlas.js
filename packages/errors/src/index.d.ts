declare module '@atlas.js/errors' {
  import ajv from 'ajv'

  export class FrameworkError extends Error { }

  export class ValidationError extends FrameworkError {
    constructor(errors: Array<ajv.ErrorObject>)

    /** Errors returned by Ajv */
    errors: Array<ajv.ErrorObject>
  }
}
