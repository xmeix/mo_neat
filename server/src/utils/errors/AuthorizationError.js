import BaseError from "./BaseError.js";

class AuthorizationError extends BaseError {
  constructor(description = "Authorization Error") {
    super("AuthorizationError", 403, true, description);
  }
}

export default AuthorizationError;
