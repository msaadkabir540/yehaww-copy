const Joi = require("joi");

const validateRequiredString = Joi.string().required();
const validateOptionalString = Joi.string().optional();
const validateOptionalNumber = Joi.number().optional();
const validateRequiredNumber = Joi.number().min(0).required();
const validateRequiredInteger = Joi.number().integer().min(1).required();
const validateOptionalInteger = Joi.number().integer().min(1).optional();
const validateRequiredDate = Joi.date().required();
const currencyPattern = new RegExp(
  /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/
);
const base64ImgPattern = new RegExp(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
const httpsImgPattern = new RegExp(/^https\:\/\/yehaww-bucket([.\/\-a-zA-Z0-9])+$/);
const httpsImgPatternProd = new RegExp(/^https\:\/\/yehaww-prod([.\/\-a-zA-Z0-9])+$/);
const validatePattern = (pattern, required = true) =>
  Joi.string().pattern(pattern)[required ? `required` : `optional`]();
const validateYesNo = (required = true) =>
  Joi.string().valid("Yes", "No")[required ? `required` : `optional`]();

const sortBy = ["latest", "startDate", "salary"];

const currencies = [
  "EUR (€)",
  "USD ($)",
  "GBP (£)",
  "INR (₹)",
  "AUD ($)",
  "CAD ($)",
  "SGD ($)",
  "ZAR (R)",
  "NZD ($)",
  "JPY (¥)",
  "CHF (Fr)",
  "MXN ($)",
  "CNY (¥)",
  "SEK (kr)",
  "RUB (₽)",
  "HKD ($)",
  "NOK (kr)",
  "TRY (₺)",
  "KRW (₩)",
  "BRL (R$)",
];

module.exports = {
  sortBy,
  currencies,
  validateYesNo,
  currencyPattern,
  validatePattern,
  httpsImgPattern,
  base64ImgPattern,
  httpsImgPatternProd,
  validateRequiredDate,
  validateOptionalNumber,
  validateRequiredString,
  validateOptionalString,
  validateRequiredNumber,
  validateRequiredInteger,
  validateOptionalInteger,
};
