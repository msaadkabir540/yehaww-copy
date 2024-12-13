const Joi = require("joi");
const { base64ImgPattern } = require("../job/helper");

module.exports.validateJob = Joi.object({
  profilePicture: Joi.string()
    .pattern(base64ImgPattern)
    .optional()
    .allow("")
    .label("Profile Picture")
    .messages({
      "string.pattern.base": "Profile Picture must be in png, jpeg or jpg formats.",
    }),
});
