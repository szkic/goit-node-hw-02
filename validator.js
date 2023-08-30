const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

const editSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

const editFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

exports.validateAddContact = validator(addSchema);
exports.validateEditContact = validator(editSchema);
exports.validateFavorite = validator(editFavorite);
exports.validateSignup = validator(signupSchema);
