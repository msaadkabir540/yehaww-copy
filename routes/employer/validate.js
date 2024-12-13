const Joi = require("joi");

const { validateRequiredString, base64ImgPattern } = require("./helper");

module.exports.validatePersonalDetails = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  personalDetails: Joi.object({
    firstName: validateRequiredString.label("Forename"),
    lastName: validateRequiredString.label("Surname"),
    email: Joi.string().email().required().label("Email"),
    companyName: validateRequiredString.label("Company Name"),
    numberOfHorses: Joi.number().optional().label("Number Of Horses"),
    businessAddress: Joi.string().min(15).required().label("Business Address"),
    phoneNumber: Joi.string().required().label("Phone Number"),
    profilePicture: Joi.string()
      .pattern(base64ImgPattern)
      .optional()
      .allow("")
      .label("Profile Picture")
      .messages({
        "string.pattern.base": "Profile Picture must be in png, jpeg or jpg formats.",
      }),
  }),
});

module.exports.validateSettings = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  emailAlerts: Joi.boolean().label("Email Alerts"),
  shortListedCandidates: Joi.boolean().label("Short Listed Candidates"),
}).or("emailAlerts", "shortListedCandidates");
