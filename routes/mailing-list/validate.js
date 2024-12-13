const Joi = require("joi");
const { validateRequiredString } = require("../candidate/helper");

module.exports.validateMail = Joi.object({
  email: Joi.string().email().required(),
});

module.exports.validateContact = Joi.object({
  name: validateRequiredString.required(),
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().min(5).required(),
});
