const validateValidStringArr = (arr, required = true) =>
  Joi.string()
    .valid(...arr)
    [required ? `required` : `optional`]();

module.exports({ validateValidStringArr });
