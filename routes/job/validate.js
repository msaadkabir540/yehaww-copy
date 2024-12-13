const Joi = require("joi");

const {
  sortBy,
  currencies,
  validateYesNo,
  validatePattern,
  currencyPattern,
  httpsImgPattern,
  base64ImgPattern,
  httpsImgPatternProd,
  validateRequiredDate,
  validateOptionalString,
  validateRequiredString,
  validateRequiredNumber,
  validateOptionalNumber,
  validateRequiredInteger,
} = require("./helper");
const {
  languages,
  experience,
  visaOptions,
  country_list,
  genderOptions,
  newPositionArr,
  newPositionArr1,
  companyTypeOptions,
  availabilityOptions,
  validateValidStringArr,
  levelOfOperationOptions,
  employeesExpectation,
} = require("../../utils/arrayHelper");
const {
  employmentTypes,
  skills,
  educationOptions,
  experienceLevel,
} = require("../candidate/helper");

module.exports.validateJob = Joi.object({
  job: Joi.object({
    jobCategory: validateValidStringArr(
      newPositionArr1.filter((x) => x?.includes("+")).map((x) => x?.replace("+", ""))
    ).label("Job Category"),
    jobTitle: validateValidStringArr([
      ...new Set(
        newPositionArr1
          .filter((x) => !x.includes("+"))
          .map((x) => `${x.split("-")[0]} (${x.split("-")[1]})`)
      ),
    ]).label("Job Title"),
    employmentType: validateValidStringArr(employmentTypes).label("Employment Type"),
    companyInfo: Joi.object({
      companyType: validateValidStringArr(companyTypeOptions).label("Company Type"),
      companySize: validateRequiredNumber.label("Company Size"),
      numOfHorses: validateOptionalNumber.label("Number Of Horses"),
      companyName: validateOptionalString.allow("").label("Company Name"),
      levelOfOperation: validateValidStringArr(levelOfOperationOptions).label("Level Of Operation"),
    }),
    positionInfo: Joi.object({
      homeBase: Joi.object({
        country: validateValidStringArr(country_list).label("Country"),
        city: validateRequiredString.label("City"),
        address: Joi.string().allow("").label("Home Base Address"),
      }),
      currentlyLocated: Joi.object({
        country: validateValidStringArr(country_list).required().label("Country"),
        city: validateRequiredString.label("City"),
      }).required(),
      competition: Joi.object({
        country: Joi.array()
          .items(validateValidStringArr(country_list, (required = false)))
          .label("Country"),
        name: validateOptionalString.label("Competition Name"),
      }).optional(),
      startDate: validateRequiredDate.label("Start Date"),
      currency: Joi.alternatives().conditional("salary", {
        is: Joi.string().min(1),
        then: validateValidStringArr(currencies).label("Currency"),
        otherwise: Joi.string().allow("").optional().label("Currency"),
      }),
      location: Joi.object({
        name: validateOptionalString.label("Location"),
        coordinates: Joi.object({
          lat: Joi.number(),
          lng: Joi.number(),
        }),
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
        then: Joi.string().valid("Per Month", "Per Day").required().label("Salary Basis"),
        otherwise: Joi.string().allow("").optional().required().label("Salary Basis"),
      }),

      aboutThePosition: validateRequiredString
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
      liveIn: validateYesNo(true).label("Live In"),
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
      gender: validateValidStringArr(genderOptions).label("Gender"),
      languages: Joi.array()
        .items(
          Joi.object({
            name: validateValidStringArr(languages.map((x) => x.name)).label("Language Name"),
            fluency: validateValidStringArr(["Basic", "Intermediate", "Advanced", "Fluent"]).label(
              "Language Fluency"
            ),
          })
        )
        .unique((a, b) => a.name === b.name)
        .min(1)
        .required(),
      nationality: Joi.array()
        .items(validateValidStringArr(["Any", ...country_list]))
        .min(1)
        .required()
        .label("Nationality"),
      visa: Joi.object({
        visaType: Joi.array()
          .items(validateValidStringArr(visaOptions, false))
          .optional()
          .label("Visa Type"),
      }).required(),
      availability: validateValidStringArr(availabilityOptions).label("Availability"),
      candidateCurrentlyBased: Joi.array()
        .items(validateValidStringArr(["Any", ...country_list]))
        .min(1)
        .required()
        .label("Candidate Currently Based"),
      professionalExperience: validateValidStringArr(experience).label(
        "Professional Equine Experience"
      ),
      team: validateValidStringArr(["Don't mind", "Yes", "No"]).label(
        "Are you Looking for a Team/Couple?"
      ),
      bringOwnHorse: validateValidStringArr(["Yes", "No"]).label(
        "Possibility To Bring Your own Horse?"
      ),
      bringOwnDog: validateValidStringArr(["Yes", "No"]).label("Possibility To Have Your Own Dog?"),
    }),
  }),
});

module.exports.validateGetAllJobs = Joi.object({
  position: validateValidStringArr(
    [
      ...new Set(
        newPositionArr1
          .filter((x) => !x.includes("+"))
          .map((x) => `${x.split("-")[0]} (${x.split("-")[1]})`)
      ),
      ...new Set(newPositionArr1.filter((x) => !x.includes("+")).map((x) => x.split("-")[0])),
    ],
    false
  ).label("Job Title"),
  type: validateValidStringArr(companyTypeOptions, false).label("Company Type"),
  jobType: validateValidStringArr(["Hands On", "Stay Clean"], false).label("Job Type"),
  levelOfOperation: validateValidStringArr(levelOfOperationOptions, false).label(
    "Level Of Operation"
  ),
  companySize: validateOptionalNumber.label("Company Size"),
  companyName: validateOptionalString.label("Company Name"),
  category: validateValidStringArr(
    newPositionArr1.filter((x) => x.includes("+")).map((x) => x?.replace("+", "")),
    false
  ).label("Category"),
  employmentType: validateValidStringArr(employmentTypes, false).label("Employment Type"),
  homeBaseCountry: validateOptionalString.label("Home Base Country"),
  currentlyLocatedCountry: validateOptionalString.label("Currently Located Country"),
  currency: validatePattern(currencyPattern, false).label("Currency"),
  salary: Joi.number().integer().min(0).max(6).optional().label("Salary"),
  gender: validateValidStringArr(genderOptions, false).label("Gender"),
  visa: validateValidStringArr(visaOptions, false).label("Visa"),
  availability: validateValidStringArr(availabilityOptions, false).label("Availability"),
  nationality: Joi.array().items(validateValidStringArr(country_list, false)).label("Nationality"),
  candidateCurrentlyBased: Joi.array()
    .items(validateValidStringArr(country_list, false))
    .label("Candidate Currently Based"),
  team: validateYesNo(false).label("Team"),
  professionalExperience: validateValidStringArr(experience, false).label(
    "Professional Experience"
  ),
  properties: validateOptionalString,
  pageSize: validateRequiredInteger,
  page: validateRequiredInteger.min(0),
  sortBy: validateValidStringArr(sortBy, false).label("Sort By"),
  mapView: validateValidStringArr(["true", "false"], false).label("Map View"),
  liveIn: validateYesNo(false).label("Live In"),
});

module.exports.validateActivePosts = Joi.object({
  sortBy: validateValidStringArr(["jobTitle", "jobId", "createdAt", "daysRemaining"], false),
  properties: validateOptionalString,
  pageSize: validateRequiredInteger,
  page: validateRequiredInteger.min(0),
});

module.exports.validateJobId = Joi.object({
  jobId: validateRequiredString,
  interested: Joi.boolean().required(),
  coverLetter: Joi.string()
    .when("interested", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .label("Cover Letter"),
});
module.exports.validateShortListedCandidates = Joi.object({
  jobId: validateRequiredString,
  userId: validateRequiredString,
  interestedStatus: validateValidStringArr(["true", "false"], false).label("Interested Status"),
});

module.exports.validateShortListedCandidatesBody = Joi.object({
  jobId: validateRequiredString,
  userId: validateRequiredString,
  notes: validateOptionalString,
  interestedStatus: validateValidStringArr(["true", "false", "none"], false).label(
    "Interested Status"
  ),
});

module.exports.validateInterviewQuestions = Joi.object({
  jobId: validateRequiredString,
  userId: validateRequiredString,
  videoInterviewRequest: Joi.boolean().optional().label("Video Interview Request"),
  interviewQuestions: Joi.array()
    .items(Joi.string().optional())
    .min(1)
    .required()
    .label("Interview Questions"),
});

module.exports.validateAppliedCandidates = Joi.object({
  pageSize: validateRequiredInteger,
  page: validateRequiredInteger.min(0),
  jobId: validateOptionalString,
  allShortListed: validateValidStringArr(["true"], false),
  candidateType: validateValidStringArr(["", "shortlisted", "notInterested"], false).label(
    "Candidate Type"
  ),
  gender: validateValidStringArr([...genderOptions, "All"], false),
  visas: Joi.array().items(validateValidStringArr(visaOptions, false)),
  availability: validateValidStringArr(availabilityOptions, false),
  nationalities: Joi.array().items(validateValidStringArr(country_list, false)),
  teamCouple: Joi.boolean().optional().label("Team Couple"),
  verified: Joi.boolean().optional(),
  video: Joi.boolean().optional(),
  qualifications: Joi.array().items(validateValidStringArr(educationOptions, false)),
  skills: Joi.array().items(validateValidStringArr(skills, false)),
  experienceLevelName: Joi.array()
    .items(validateValidStringArr(experienceLevel, false))
    .label("Experience Level Name"),
  languages: Joi.array().items(
    validateValidStringArr(
      languages.map((x) => x.name),
      false
    )
  ),
  pageSize: validateRequiredInteger,
  page: validateRequiredInteger.min(0),
});

module.exports.validateAddCoverLetter = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  jobId: validateRequiredInteger,
  coverLetter: Joi.string().min(10).required().label("Cover Letter"),
});

module.exports.validateAddCandidateNote = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  jobId: validateRequiredInteger,
  candidateId: Joi.string().required(),
  candidateNote: Joi.string().min(10).required().label("Candidate Note"),
});
