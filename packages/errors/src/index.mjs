/**
 * Generic error class for all errors explicitly created within @atlas.js
 * @extends Error
 */
class FrameworkError extends Error {
  constructor(message) {
    super(message)
    // Fix error name in stack traces
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
  }
}

/**
 * Error representing a failed JSON schema validation
 * @extends    FrameworkError
 */
class ValidationError extends FrameworkError {
  constructor(errors = {}) {
    super('Atlas.js validation error')

    this.errors = errors
  }
}

export {
  FrameworkError,
  ValidationError,
}
