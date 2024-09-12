import Joi from "joi";

export const RegisterationValidation = Joi.object().keys({
  name: Joi.string().min(3).max(100).required().label("name").messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name should have a minimum of {#limit} characters",
    "string.max": "Name should have a maximum of {#limit} characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().label("email").messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .regex(
      /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/
    )
    .required()
    .label("password")
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      "any.required": "Password is required",
    }),
});

export const PasswordValidation = Joi.object().keys({
  password: Joi.string()
    .regex(
      /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/
    )
    .required()
    .label("password")
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      "any.required": "Password is required",
    }),
});

export const LoginValidation = Joi.object().keys({
  email: Joi.string().email().required().label("email").messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().label("password").messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});
