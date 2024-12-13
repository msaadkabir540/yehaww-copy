const Joi = require("joi");
const { entities, validatePass, validatePassMsg, employerValidatePass } = require("./helper");

module.exports.validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(validatePass).message(validatePassMsg("Password")).required(),
});

module.exports.validateSocialLogin = Joi.object({
  type: Joi.string(),
  fbUserID: Joi.string(),
  newsLetter: Joi.boolean(),
  code: Joi.string().required(),
  accountType: Joi.string().required(),
});

module.exports.validateForgetPass = Joi.object({
  email: Joi.string().email().required(),
});

module.exports.validateChangePassword = Joi.object({
  newPassword: Joi.string()
    .pattern(employerValidatePass)
    .message(validatePassMsg("Password"))
    .required()
    .label("New Password"),
  confirmNewPassword: Joi.string().required().label("Confirm New Password"),
});

module.exports.validateResetPassword = Joi.object({
  token: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .pattern(validatePass)
    .message(validatePassMsg("Password"))
    .required()
    .label("Password"),
});

module.exports.validateDeleteProfile = Joi.object({
  password: Joi.string().optional(),
});

module.exports.validateSignup = Joi.alternatives().conditional(
  Joi.object({ type: "candidate" }).unknown(),
  {
    then: Joi.object({
      type: Joi.string().required(),
      forename: Joi.string().required().label("Forename"),
      surname: Joi.string().required().label("Surname"),
      email: Joi.string().email().required().label("Email"),
      password: Joi.string()
        .pattern(validatePass)
        .message(validatePassMsg("Password"))
        .required()
        .label("Password"),
      newsLetter: Joi.boolean().optional().label("News Letter"),
      terms: Joi.boolean().valid(true).required().label("Terms"),
    }),
    otherwise: Joi.alternatives().conditional(Joi.object({ type: "employer" }).unknown(), {
      then: Joi.object({
        type: Joi.string().required(),
        forename: Joi.string().required().label("Forename"),
        surname: Joi.string().required().label("Surname"),
        entity: Joi.string()
          .valid(...entities)
          .required()
          .label("Entity"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string()
          .pattern(validatePass)
          .message(validatePassMsg("Password"))
          .required()
          .label("Password"),
        telephone: Joi.string()
          .pattern(new RegExp(/^[0-9]{8,15}$/i))
          .message("Invalid Phone number: must contain 8 to 15 digits")
          .required()
          .label("Phone"),
        signUpReferral: Joi.string().optional().label("Referral Code"),
        companyName: Joi.string().min(1).max(25).required().label("Company Name"),
        businessAddress: Joi.string().min(15).required().label("Business Address"),
        newsLetter: Joi.boolean().optional().label("News Letter"),
        terms: Joi.boolean().valid(true).required().label("Terms"),
      }),
    }),
  }
);
