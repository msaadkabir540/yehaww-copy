const Joi = require("joi");
const { validateValidStringArr, country_list } = require("../../utils/arrayHelper");

module.exports.validateAdvertisers = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  organization: Joi.string().required(),
  businessPhone: Joi.string().required().label("Business Phone"),
  streetAddress: Joi.string().required().label("Street Address"),
  addressLine2: Joi.string().required().label("Address Line 2"),
  city: Joi.string().required(),
  postalCode: Joi.string().max(12).required().label("Postal Code"),
  country: validateValidStringArr(country_list),
  email: Joi.string().email().required(),
  cellPhone: Joi.string().required().label("Cell Phone"),
  typesOfAdvertising: Joi.array()
    .items(validateValidStringArr(["Email", "Web or Social Media", "Online Directories"]))
    .min(1)
    .required()
    .label("Types Of Advertising"),
  equestrian: Joi.string().valid("Yes", "No").required(),
  description: Joi.string().required(),
});
