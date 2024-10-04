class ApiErrors extends Error {
  constructor(
    statusCode,
    message = "Something went worng",
    errors = [],
    statck = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = statck;
    this.message = message;
    this.data = null;
    this.success = false;

    if (statck) {
      this.stack = statck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiErrors };
