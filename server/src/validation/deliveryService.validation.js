import Joi from "joi";

export const DeliveryServiceValidation = Joi.object({
  code: Joi.string()
    .min(3)
    .max(50)
    .required()
    .label("Delivery Service Code")
    .messages({
      "string.base": "Delivery Service Code must be a string",
      "string.empty": "Delivery Service Code is required",
      "string.min":
        "Delivery Service Code should have at least {#limit} characters",
      "string.max":
        "Delivery Service Code should not exceed {#limit} characters",
      "any.required": "Delivery Service Code is required",
    }),
  description: Joi.string().optional().label("Description").messages({
    "string.base": "Description must be a string",
  }),
  isActive: Joi.boolean().optional().default(true).label("Is Active").messages({
    "boolean.base": "Is Active must be a boolean value",
  }),
});

export const DeliveryServiceUpdateValidation = Joi.object({
  tmCode: Joi.string()
    .min(3)
    .max(50)
    .required()
    .label("Delivery Service Code")
    .messages({
      "string.base": "Delivery Service Code must be a string",
      "string.empty": "Delivery Service Code is required",
      "string.min":
        "Delivery Service Code should have at least {#limit} characters",
      "string.max":
        "Delivery Service Code should not exceed {#limit} characters",
      "any.required": "Delivery Service Code is required",
    }),

  carrierName: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .default("")
    .label("Carrier Name")
    .messages({
      "string.base": "Carrier Name must be a string",
      "string.min": "Carrier Name should have at least {#limit} characters",
      "string.max": "Carrier Name should not exceed {#limit} characters",
    }),
});
