import BaseError from "./BaseError.js";

class ValidationError extends BaseError {
  constructor(description = "Validation Error") {
    super("ValidationError", 400, true, description);
  }
}

export default ValidationError;
