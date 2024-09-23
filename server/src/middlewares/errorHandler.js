import BaseError from "../utils/errors/BaseError.js";
import ValidationError from "../utils/errors/ValidationError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      status: "Validation Error",
      message: err.message,
    });
  }

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.name,
      message: JSON.stringify({
        key: "Error",
        message: err.message,
      }),
    });
  }

  return res.status(500).json({
    success: false,
    status: "Unknown Error",
    message: JSON.stringify({
      key: "Unknown Error",
      message: "An unexpected error occurred",
    }),
  });
};

export default errorHandler;
