import Joi from "joi";

export const ProductValidation = Joi.object({
  title: Joi.string().min(3).required().label("Title").messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title should have at least {#limit} characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().required().label("Description").messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  stock: Joi.number().min(0).required().label("Stock").messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be less than {#limit}",
    "any.required": "Stock is required",
  }),
  categories: Joi.array()
    .items(Joi.string().required())
    .required()
    .label("Categories")
    .messages({
      "array.base": "Categories must be an array",
      "array.includesRequiredUnknowns": "Each category must be a string",
      "any.required": "Categories are required",
    }),
  sizes: Joi.array().items(Joi.string()).optional().label("Sizes").messages({
    "array.base": "Sizes must be an array of strings",
  }),
  colors: Joi.array()
    .items(
      Joi.string()
        .pattern(/^#([0-9A-Fa-f]{6})$/, "hex color")
        .required()
    )
    .optional()
    .label("Colors")
    .messages({
      "array.base": "Colors must be an array of strings",
      "string.pattern.base":
        "Each color must be a valid 6-character hexadecimal code starting with #",
    }),
  onSale: Joi.boolean().required().label("On Sale").messages({
    "boolean.base": "On Sale must be a boolean value",
    "any.required": "On Sale status is required",
  }),
  price_before_sale: Joi.number()
    .positive()
    .required()
    .label("Price Before Sale")
    .messages({
      "number.base": "Price before sale must be a number",
      "number.positive": "Price before sale must be a positive number",
      "any.required": "Price before sale is required",
    }),
  discountPercentage: Joi.number()
    .min(0)
    .max(100)
    .when("onSale", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .label("Discount Percentage")
    .messages({
      "number.base": "Discount percentage must be a number",
      "number.min": "Discount percentage cannot be less than {#limit}",
      "number.max": "Discount percentage cannot be more than {#limit}",
      "any.required":
        "Discount percentage is required when the product is on sale",
    }),
});
