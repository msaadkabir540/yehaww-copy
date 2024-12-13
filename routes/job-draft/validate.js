const Joi = require("joi");

const {
  currencies,
  validateYesNo,
  httpsImgPattern,
  base64ImgPattern,
  httpsImgPatternProd,
  validateOptionalString,
  validateRequiredNumber,
  validateOptionalNumber,
  validateRequiredInteger,
} = require("../job/helper");
const {
  languages,
  experience,
  visaOptions,
  country_list,
  genderOptions,
  newPositionArr1,
  companyTypeOptions,
  availabilityOptions,
  employeesExpectation,
  validateValidStringArr,
  levelOfOperationOptions,
} = require("../../utils/arrayHelper");
const { employmentTypes } = require("../candidate/helper");

module.exports.validateDraft = Joi.object({
  job: Joi.object({
    jobCategory: validateValidStringArr(
      newPositionArr1.filter((x) => x?.includes("+")).map((x) => x?.replace("+", "")),
      false
    ).label("Job Category"),
    jobTitle: validateValidStringArr(
      [
        ...new Set(
          newPositionArr1
            .filter((x) => !x.includes("+"))
            .map((x) => `${x.split("-")[0]} (${x.split("-")[1]})`)
        ),
      ],
      false
    ).label("Job Title"),

    employmentType: validateValidStringArr(employmentTypes).optional().label("Employment Type"),

    companyInfo: Joi.object({
      companyType: validateValidStringArr(companyTypeOptions).allow("").label("Company Type"),
      companySize: validateRequiredNumber.optional().label("Company Size"),
      numOfHorses: validateOptionalNumber.optional().label("Number Of Horses"),
      companyName: validateOptionalString.allow("").label("Company Name"),
      levelOfOperation: validateValidStringArr(levelOfOperationOptions)
        .optional()
        .label("Level Of Operation"),
    }),
    positionInfo: Joi.object({
      homeBase: Joi.object({
        country: validateValidStringArr(country_list, false).label("Country"),
        city: validateOptionalString.allow("").label("City"),
        address: Joi.string().allow("").label("Home Base Address"),
      }),
      currentlyLocated: Joi.object({
        country: validateValidStringArr(country_list, false).label("Country"),
        city: validateOptionalString.allow("").label("City"),
      }),
      competition: Joi.object({
        country: Joi.array().items(validateValidStringArr(country_list, false)).label("Country"),
        name: validateOptionalString.label("Competition Name"),
      }).optional(),
      startDate: Joi.date().optional().label("Start Date"),
      currency: Joi.alternatives().conditional("salary", {
        is: Joi.string().min(1),
        then: validateValidStringArr(currencies, false).label("Currency"),
        otherwise: Joi.string().allow("").optional().label("Currency"),
      }),
      salary: Joi.string()
        .pattern(/^([1-9]\d*)(\/|-)?([1-9]\d*)?$/)
        .optional()
        .allow("")
        .messages({
          "string.pattern.base":
            "Must be in format of number or range of numbers, like '1500/2000' or '1500-2000'",
        }),
      salaryBasis: Joi.alternatives().conditional("salary", {
        is: Joi.string().min(1),
        then: Joi.string().valid("Per Month", "Per Day").label("Salary Basis"),
        otherwise: Joi.string().allow("").optional().label("Salary Basis"),
      }),

      aboutThePosition: validateOptionalString
        .custom((value, helper) => {
          if (value.includes("@")) {
            return helper.message("Must not include email!");
          } else if (new RegExp(/\d{4}/i).test(value)) {
            return helper.message("Must not include phone number!");
          } else if (value.includes("http") || value.includes(".com") || value.includes("www")) {
            return helper.message("Must not include a URL!");
          } else {
            return true;
          }
        })
        .label("About The Position"),
      aboutThePositionOtherLanguage: validateValidStringArr(
        languages.map((x) => x.name),
        false
      )
        .optional()
        .label("About The Position Other Language"),
      aboutThePositionOtherLanguageText: validateOptionalString
        .custom((value, helper) => {
          if (value.includes("@")) {
            return helper.message("Must not include email!");
          } else if (new RegExp(/\d{4}/i).test(value)) {
            return helper.message("Must not include phone number!");
          } else if (value.includes("http") || value.includes(".com") || value.includes("www")) {
            return helper.message("Must not include a URL!");
          } else {
            return true;
          }
        })
        .label("About The Position Other Language Text"),
      employeeExpectations: Joi.array()
        .items(validateValidStringArr([...employeesExpectation], (required = false)))
        .optional()
        .max(6)
        .allow("")
        .label("What Are Employees Expectations"),
      liveIn: validateYesNo(false).label("Live In"),
      image: Joi.alternatives()
        .try(
          Joi.string().regex(base64ImgPattern),
          Joi.string().regex(
            process.env.NODE_ENV === "development" ? httpsImgPattern : httpsImgPatternProd
          )
        )
        .allow({}, "")
        .optional()
        .label("Image"),
    }),
    preferredCandidate: Joi.object({
      gender: validateValidStringArr(genderOptions).optional().label("Gender"),
      languages: Joi.array()
        .items(
          Joi.object({
            name: validateValidStringArr(languages.map((x) => x.name))
              .allow("")
              .label("Language Name"),
            fluency: validateValidStringArr(["Basic", "Intermediate", "Advanced", "Fluent"])
              .allow("")
              .label("Language Fluency"),
          })
        )
        .unique((a, b) => a.name === b.name)
        .min(1),
      nationality: Joi.array()
        .items(validateValidStringArr(["Any", ...country_list]))
        .label("Nationality"),
      visa: Joi.object({
        visaType: Joi.array()
          .items(validateValidStringArr(visaOptions, false))
          .optional()
          .label("Visa Type"),
      }),
      availability: validateValidStringArr(availabilityOptions).optional().label("Availability"),
      candidateCurrentlyBased: Joi.array()
        .items(validateValidStringArr(["Any", ...country_list]))
        .label("Candidate Currently Based"),
      professionalExperience: validateValidStringArr(experience)
        .optional()
        .label("Professional Equine Experience"),
      team: validateValidStringArr(["Don't mind", "Yes", "No"])
        .optional()
        .label("Are you Looking for a Team/Couple?"),
      bringOwnHorse: validateValidStringArr(["Yes", "No"])
        .optional()
        .label("Possibility To Bring Your own Horse?"),
      bringOwnDog: validateValidStringArr(["Yes", "No"])
        .optional()
        .label("Possibility To Have Your Own Dog?"),
    }),
  }),
});

module.exports.validateDraftByEmployer = Joi.object({
  sortBy: validateValidStringArr(["jobTitle", "jobId", "createdAt", "daysRemaining"], false),
  properties: validateOptionalString,
  pageSize: validateRequiredInteger,
  page: validateRequiredInteger.min(0),
});
