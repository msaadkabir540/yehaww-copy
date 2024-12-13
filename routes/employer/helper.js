const Joi = require("joi");

const validateRequiredString = Joi.string().required();
const base64ImgPattern = new RegExp(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
const validatePass = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!-%&*?]{8,20}$/
);
const validatePassMsg = (key) =>
  key +
  " : Pattern does not match: One uppercase, one lowercase, one letter, min 8 and max 20 length";
const validatePattern = (pattern, required = true) =>
  Joi.string().pattern(pattern)[required ? `required` : `optional`]();

module.exports = {
  validatePass,
  validatePattern,
  validatePassMsg,
  base64ImgPattern,
  validateRequiredString,
};
