const Joi = require("joi");

const {
  languages,
  country_list,
  genderOptions,
  nationalities,
  newPositionArr1,
} = require("../../utils/arrayHelper");
const {
  skills,
  urlPattern,
  visaOptions,
  disciplines,
  validateYesNo,
  referenceTypes,
  employmentTypes,
  experienceLevel,
  experienceTypes,
  validatePattern,
  educationOptions,
  base64PdfPattern,
  validateExpiryDate,
  generalExperiences,
  validateExperience,
  availabilityOptions,
  validateRequiredDate,
  validateRequiredString,
  validateValidStringArr,
  experienceLevelOptions,
  validateOptionalString,
  levelOfOperationOptions,
  validateRequiredInteger,
  experienceDurationOptions,
} = require("./helper");

const validateWordLimit = (value, helpers, limit) => {
  const words = value?.trim()?.split(/\s+/);
  if (words.length > limit) {
    return helpers.error("string.max", { limit });
  }
  return value;
};
module.exports.validatePersonalInfo = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  personalInfo: Joi.object({
    contactDetail: Joi.object({
      firstName: validateRequiredString.label("First Name"),
      lastName: validateRequiredString.label("Last Name"),
      email: Joi.string().email().required().label("Email"),
      phoneNumber: Joi.string().required().label("Phone Number"),
    }),
    desiredPosition: Joi.object({
      firstChoice: validateValidStringArr([
        ...new Set(
          newPositionArr1
            .filter((x) => !x.includes("+"))
            .map((x) => `${x.split("-")[0]} (${x.split("-")[1]})`)
        ),
      ]).label("First Choice"),
      secondChoice: validateValidStringArr([
        ...new Set(
          newPositionArr1
            .filter((x) => !x.includes("+"))
            .map((x) => `${x.split("-")[0]} (${x.split("-")[1]})`)
        ),
      ]).label("Second Choice"),
      jobAlerts: Joi.object({
        locations: Joi.array()
          .items(validateValidStringArr(country_list, false))
          .unique((a, b) => a === b)
          .label("Location"),
        positions: Joi.array()
          .items(
            validateValidStringArr(
              [
                ...new Set(
                  newPositionArr1
                    .filter((x) => !x.includes("+"))
                    .map((x) => `${x.split("-")[0]} (${x.split("-")[1]})`)
                ),
              ],
              false
            )
          )
          .unique((a, b) => a === b)
          .required()
          .label("Position"),
        employmentTypes: Joi.array()
          .items(validateValidStringArr(employmentTypes, false))
          .unique((a, b) => a === b)
          .label("Employment Type"),
      }).label("Job Alert"),
      disciplines: Joi.array()
        .items(validateValidStringArr(disciplines, false))
        .unique((a, b) => a === b)
        .label("Disciplines"),
    }),
    languages: Joi.array()
      .items(
        Joi.object({
          name: validateValidStringArr(languages.map((x) => x.name)).label("Language"),
          fluency: validateValidStringArr(["Basic", "Intermediate", "Advanced", "Fluent"]).label(
            "Fluency"
          ),
        })
      )
      .unique((a, b) => {
        if (a.name && b.name) {
          return a.name === b.name;
        }
      })
      .messages({
        "array.unique": "Language values must be unique",
      }),
    passportVisaInformation: Joi.object({
      passports: Joi.array().items(
        Joi.object({
          issuerCountry: validateValidStringArr(country_list).label("Issuing Country"),
          expiry: Joi.date()
            .optional()
            .allow("", null)
            .custom(validateExpiryDate)
            .label("Passport Expiry Date"),
          //  validateRequiredDate.label("Passport Expiry Date"),
        })
      ),
      visa: Joi.array().items(validateValidStringArr(visaOptions, false)).optional().label("Visas"),
      otherVisa: Joi.string().optional().label("Other Visas"),
    }),
    personalInformation: Joi.object({
      dateOfBirth: validateRequiredDate.label("Date Of Birth"),
      gender: validateValidStringArr(genderOptions).label("Gender"),
      nationality: Joi.array()
        .items(validateValidStringArr(country_list))
        .unique((a, b) => a === b)
        .label("Nationality"),
      smoker: validateValidStringArr(["", "Yes", "No", "Prefer not to say"], false).label("Smoker"), // optional
      visibleTattoos: validateValidStringArr(["", "Yes", "No", "Prefer not to say"], false).label(
        "Visible Tattoos"
      ), // optional
      lookingForLiveInPosition: validateYesNo(true).label("Are You Looking For Live In Position"),
    }),
    teamStatus: Joi.object({
      maritalStatus: validateValidStringArr([
        "Single",
        "Married",
        "Divorced",
        "In a Relationship",
      ]).label("Marital Status"),
      lookingForWorkAsCouple: validateValidStringArr(["Yes", "No", "Ideally"]).label(
        "Looking For Work as a Couple"
      ),
      partnerEmail: Joi.string()
        .when("lookingForWorkAsCouple", {
          is: "Yes",
          then: Joi.when("requestedPartnerVerification", {
            is: Joi.string().required(),
            then: Joi.optional().allow(""),
            otherwise: Joi.string().email().required(),
          }),
          otherwise: Joi.optional().allow(""),
        })
        .label("Partner Email"),
      requestedPartnerVerification: Joi.string()
        .allow("")
        .allow(null)
        .optional()
        .label("Requested Partner Verification"),
    }),
  }),
});

module.exports.validateAboutMe = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  aboutMe: Joi.object({
    about: Joi.string()
      .required()
      .custom((value, helpers) => validateWordLimit(value, helpers, 250))
      .label("About Me")
      .messages({
        "string.max": "Maximum 250 words",
      }),

    aboutMeAnother: Joi.object({
      language: Joi.alternatives().conditional("text", {
        is: validateRequiredString,
        then: validateValidStringArr(
          languages.map((x) => x.name),
          false
        ).label("Language"),
        otherwise: Joi.string().allow("").optional().label("Language"),
      }),
      text: Joi.alternatives().conditional(
        "language",
        {
          is: validateRequiredString,
          then: Joi.string()
            .required()
            .custom((value, helpers) => validateWordLimit(value, helpers, 250))
            .label("About Me (Another)")
            .messages({
              "string.max": "Maximum 250 words",
            }),
          otherwise: Joi.string().allow("").optional().label("About Me (Another)"),
        },
        { language: Joi.required() }
      ),
    }),

    hobbiesInterests: Joi.string()
      .required()
      .custom((value, helpers) => validateWordLimit(value, helpers, 250))
      .label("Hobbies/Interests")
      .messages({
        "string.max": "Maximum 250 words",
      }),

    hobbiesInterestsAnother: Joi.object({
      language: Joi.alternatives().conditional("text", {
        is: validateRequiredString,
        then: validateValidStringArr(
          languages.map((x) => x.name),
          false
        ).label("Language"),
        otherwise: Joi.string().allow("").optional().label("Language"),
      }),
      text: Joi.alternatives().conditional(
        "language",
        {
          is: validateRequiredString,
          then: Joi.string()
            .required()
            .custom((value, helpers) => validateWordLimit(value, helpers, 250))
            .label("Hobbies/Interests (Another)")
            .messages({
              "string.max": "Maximum 250 words",
            }),
          otherwise: Joi.string().allow("").optional().label("Hobbies/Interests (Another)"),
        },
        { language: Joi.required() }
      ),
    }),
  }),
});

module.exports.validateAvailabilityInfo = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  availabilityInfo: Joi.object({
    availability: validateValidStringArr(availabilityOptions).label("Availability"),
    currentCountry: validateValidStringArr(country_list).label("Current Country"),
    currentLocation: validateRequiredString.label("Current Location"),
  }),
});

module.exports.validateExperience = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  experience: Joi.object({
    noPreviousExperience: Joi.boolean().required(),
    professionalEquineExperience: Joi.object({
      duration: validateValidStringArr(experienceDurationOptions)
        .required()
        .label("Professional Equine Experience"),
    }).required(),
    generalExperience: Joi.array()
      .ordered()
      .items(
        Joi.object({
          name: validateValidStringArr(generalExperiences).label("Experience Name"),
          duration: validateValidStringArr(experienceDurationOptions).label("Experience Duration"),
        })
      )
      .unique((a, b) => a.name === b.name),
    experienceLevel: Joi.array()
      .items(
        Joi.object({
          name: validateValidStringArr(experienceLevel),
          experienceLevel: validateValidStringArr(experienceLevelOptions).label("Experience Level"),
          experienceType: validateValidStringArr(experienceTypes).label("Experience Type"),
        })
      )
      .unique((a, b) => a.name === b.name),
  }).when(Joi.object({ noPreviousExperience: Joi.boolean().valid(false) }).unknown(), {
    then: Joi.object({
      experiences: Joi.array()
        // .min(1)
        .items(
          Joi.object({
            startDate: validateRequiredDate.label("Start Date"),
            stillEmployed: Joi.boolean().required().label("Previous Experience"),
            nameOfCompany: validateRequiredString.label("Name Of Company"),
            levelOfOperation:
              validateValidStringArr(levelOfOperationOptions).label("Level Of Operation"),
            sizeOfCompany: Joi.number().min(1).required().label("Size Of Company"),
            numberOfHorses: Joi.number().min(0).required().label("Number of Horses"),
            positionRole: Joi.string().min(5).max(100).required().label("Position Role"),
            description: Joi.string()
              .min(5)
              .required()
              .custom((value, helpers) => validateWordLimit(value, helpers, 300))
              .label("Description")
              .messages({
                "string.max": "Maximum 300 words",
              }),
          }).when(Joi.object({ stillEmployed: Joi.boolean().valid(false) }).unknown(), {
            then: Joi.object({
              endDate: validateRequiredDate.label("End Date"),
            }),
          })
        ),
    }),
    otherwise: Joi.object({
      experiences: Joi.array(),
    }),
  }),
});

// .unique((a, b) => {
//   const format = (date) => {
//     return moment(date).format("YYYY-MM-DD");
//   };
//   return (
//     format(a.startDate) === format(b.startDate) ||
//     (!a.stillEmployed && !b.stillEmployed && format(a.endDate) === format(b.endDate)) ||
//     format(a.startDate) === format(a.endDate)
//   );
// }),

module.exports.validateSkillsDriverLicense = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  skillsDriverLicense: Joi.object({
    licenses: Joi.object({
      BLicense: validateYesNo(true).label("B License"),
      BELicense: validateYesNo(true).label("BE License"),
      HGV: validateYesNo(true).label("HGV License"),
      HGVAndTrailer: validateYesNo(true).label("HGV And Trailer License"),
      code95: validateYesNo(true).label("Code95 License"),
    }),
    skills: Joi.object({
      clipping: validateExperience.label("Clipping"),
      longing: validateExperience.label("Longing"),
      longReining: validateExperience.label("Long Reining"),
      handlingStallion: validateExperience.label("Handling Stallion"),
      handlingYoungHorses: validateExperience.label("Handling Young Horses"),
      exerciseRiding: validateExperience.label("Exercise Riding"),
      hacking: validateExperience.label("Hacking"),
      breakingIn: validateExperience.label("Breaking In"),
      FEIExperience: validateExperience.label("FEI Experience"),
      teaching: validateExperience.label("Teaching"),
      braiding: validateExperience.label("Braiding"),
      bandaging: validateExperience.label("Bandaging"),
      carriageDriving: validateExperience.label("Carriage Driving"),
      jumpSchool: validateExperience.label("Jump School"),
      courseBuilding: validateExperience.label("Course Building"),
      barnManagement: validateExperience.label("Barn Management"),
      eventManagement: validateExperience.label("Event Management"),
      equineFirstAid: validateExperience.label("Equine First Aid"),
      travelWithHorses: validateExperience.label("Travel With Horses"),
      logisticsPlanning: validateExperience.label("Logistics Planning"),
      transportingHorses: validateExperience.label("Transporting Horses"),
      entries: validateExperience.label("Entries"),
      equinePaperwork: validateExperience.label("Equine Paperwork"),
      championship: validateExperience.label("Championship"),
      sales: validateExperience.label("Sales"),
      computerSkills: validateExperience.label("Computer Skills"),
      marketing: validateExperience.label("Marketing"),
      socialMedia: validateExperience.label("Social Media"),
    }),
  }),
});

module.exports.validateResume = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  resume: Joi.string().allow("").label("Resume"),
});

module.exports.validateDiplomaCertifications = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  diplomaCertifications: Joi.object({
    certifications: Joi.array().items(
      Joi.object({
        title: validateRequiredString.label("Certificate Title"),
        issuedBy: validateRequiredString.label("Issued By"),
        issueDate: validateRequiredDate.label("Date Issued"),
        file: Joi.string().pattern(base64PdfPattern).allow("").required().label("File"),
        url: Joi.string().pattern(urlPattern).allow("").required(),
      })
    ),
    // .unique((a, b) => a.title === b.title || a.file === b.file || a.url === b.url),
    education: validateValidStringArr(educationOptions).label("Education"),
    filesToDelete: Joi.array()
      .items(Joi.string().pattern(urlPattern).optional())
      .unique((a, b) => a === b),
  }),
});

module.exports.validateReferences = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  filesToDelete: Joi.array()
    .items(validatePattern(urlPattern, false))
    .unique((a, b) => a === b),
  references: Joi.array().items(
    Joi.object({
      name: validateRequiredString.label("Name"),
      relationship: validateRequiredString.label("Relationship"),
      companyName: validateRequiredString.label("Company Name"),
      type: validateValidStringArr(referenceTypes).label("Type"),
      phone: Joi.string().required().label("Phone"),
      email: Joi.string().email().required().label("Email"),
      file: Joi.string().allow(null).allow("").optional(),
      url: Joi.string().allow(null).allow("").optional(),
      verified: Joi.boolean().optional(),
      denied: Joi.boolean().optional(),
    })
  ),
  // .unique(
  //   (a, b) =>
  //     a.phone === b.phone ||
  //     a.email === b.email ||
  //     (a.file && b.file && a.file !== "" && b.file !== "" ? a.file === b.file : false) ||
  //     (a.url !== "" && b.url !== "" ? a.url === b.url : false)
  // ),
})
  .exist()
  .required();

module.exports.validateUpload = Joi.object({
  _id: validateRequiredString,
  forename: validateRequiredString,
  surname: validateRequiredString,
  type: validateRequiredString,
  email: validateRequiredString,
  route: validateRequiredString,
  uploads: Joi.object({
    filesToDelete: Joi.array()
      .items(validatePattern(urlPattern))
      .unique((a, b) => a === b),
  }),
});

module.exports.validateSettings = Joi.object({
  emailAlerts: Joi.boolean().optional().label("Email Alert"),
  profilePublicView: Joi.boolean().optional().label("Profile Visible"),
});

module.exports.validateFindCandidates = Joi.object({
  position: validateValidStringArr(
    [
      ...[
        ...new Set(
          newPositionArr1.filter((x) => !x.includes("+")).map((x) => `${x.split("-")[0]}`)
        ),
      ],
      "",
    ],
    false
  ).label("Position"),
  category: validateValidStringArr(
    [
      ...[
        ...new Set(
          newPositionArr1.filter((x) => !x.includes("+")).map((x) => `${x.split("-")[1]}`)
        ),
      ],
      "",
    ],
    false
  ).label("Position"),
  availability: validateValidStringArr([...availabilityOptions, ""], false).label("Availability"),
  professionalExperience: validateValidStringArr([...experienceDurationOptions, ""], false).label(
    "Professional Equine Experience"
  ),
  currentlyBased: validateValidStringArr([...country_list, ""], false).label(
    "People Currently Based"
  ),
  gender: validateValidStringArr([...genderOptions, "All"], false).label("Gender"),
  teamCouple: Joi.boolean().optional().label("Team Couple"),
  experienceLevelName: Joi.array()
    .items(validateValidStringArr(experienceLevel, false))
    .label("Experience Level Name"),
  visas: Joi.array().items(validateValidStringArr(visaOptions, false)).label("Visas"),
  qualifications: Joi.array()
    .items(validateValidStringArr(educationOptions, false))
    .label("Qualifications"),
  nationalities: Joi.array()
    .items(validateValidStringArr(country_list, false))
    .label("Nationalities"),
  languages: Joi.array()
    .items(
      validateValidStringArr(
        languages.map((x) => x.name),
        false
      )
    )
    .label("Languages"),
  skills: Joi.array().items(validateValidStringArr(skills, false)).label("Skills"),
  video: Joi.boolean().optional().label("Video"),
  verified: Joi.boolean().optional().label("Verified"),
  properties: Joi.string().optional().label("Properties"),
  resultCard: Joi.boolean().optional().label("Result Card"),
  email: Joi.string().email().optional().label("Email"),
  lastName: Joi.string().optional().label("Last Name"),
  firstName: Joi.string().optional().label("First Name"),
  page: Joi.number().required(),
  pageSize: Joi.number().required().label("Page Size"),
  resultCard: Joi.boolean().required().label("Result Card"),
  profileCompletion: Joi.number().integer().min(0).max(100).optional().label("Profile Completion"),
});

module.exports.ValidateVideos = Joi.object({
  position: validateValidStringArr(
    [
      "All",
      ...[
        ...new Set(
          newPositionArr1
            .filter((x) => !x.includes("+"))
            .map((x) => `${x.split("-")[0]} (${x.split("-")[1]})`)
        ),
      ],
      "",
    ],
    false
  ),
  sort: validateValidStringArr(["Newest", "Oldest", ""], false),
  page: Joi.number().required(),
  pageSize: Joi.number().required(),
});

module.exports.validateVerifyReferencesQuery = Joi.object({
  userId: validateRequiredString,
  email: Joi.string().email().required(),
});

module.exports.validateVerifyReferencesBody = Joi.object({
  verified: Joi.boolean().required(),
  ratings: Joi.when("verified", {
    is: true,
    then: Joi.object({
      cleanliness: validateRequiredInteger.label("Cleanliness"),
      communication: validateRequiredInteger.label("Communication"),
      horsemanship: validateRequiredInteger.label("Horsemanship"),
      professionalism: validateRequiredInteger.label("Professionalism"),
      punctuality: validateRequiredInteger.label("Punctuality"),
      reEmploy: validateRequiredInteger.label("Re-Employ"),
      teamPlayer: validateRequiredInteger.label("Team Player"),
      thoroughness: validateRequiredInteger.label("Thoroughness"),
      workEthic: validateRequiredInteger.label("Work Ethic"),
      comment: validateOptionalString.label("Comment"),
    }),
  }),
});

module.exports.validatePartnerEmail = Joi.object({
  partnerEmail: Joi.string().email().required().label("Partner Email"),
});

module.exports.validatePartnerConfirmationQuery = Joi.object({
  candidateEmail: Joi.string().email().required().label("Candidate Email"),
  partnerEmail: Joi.string().email().required().label("Partner Email"),
});
