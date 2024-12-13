const express = require("express");

const {
  metaData,
  settings,
  getProfile,
  getAllVideos,
  findCandidate,
  verifyReferences,
  clearPartnerEmail,
  updateProfileLink,
  getReferenceDetails,
  // bulkAddProfileLink,
  requestPartnerVerification,
  partnerConfirmation,
} = require("../../controllers/candidate");
const { candidateGenericController } = require("../../controllers/candidate/generic");
const { ensureAuth, Validator } = require("../../middleware/ensure-auth");
const { parseMiddleWare } = require("../../utils/helper");
const {
  validateResume,
  validateUpload,
  ValidateVideos,
  validateAboutMe,
  validateSettings,
  validateReferences,
  validateExperience,
  validatePartnerEmail,
  validatePersonalInfo,
  validateFindCandidates,
  validateAvailabilityInfo,
  validateSkillsDriverLicense,
  validateVerifyReferencesBody,
  validateDiplomaCertifications,
  validateVerifyReferencesQuery,
  validatePartnerConfirmationQuery,
} = require("./validate");

const app = express.Router();

app.get(
  "/profile/:id",
  (req, res, next) => {
    if (req?.header("Authorization") && req?.header("Authorization") !== "null") {
      ensureAuth(req, res, next);
    } else {
      next();
    }
  },
  getProfile
);
app.get(
  "/profile/:id/:jobId",
  (req, res, next) => {
    if (req?.header("Authorization") && req?.header("Authorization") !== "null") {
      ensureAuth(req, res, next);
    } else {
      next();
    }
  },
  getProfile
);
app.get(
  "/findCandidate",
  (req, res, next) => {
    parseMiddleWare(
      req,
      res,
      next,
      [
        // "resultCard",
        // // "teamCouple",
        // "video",
        // "verified",
        // "visas",
        // "languages",
        // "nationalities",
      ]
      // true
    );
  },
  Validator(validateFindCandidates, "query"),
  findCandidate
);
app.get("/meta-data", ensureAuth, metaData);
app.get(
  "/videos",
  Validator(ValidateVideos, "query"),
  (req, res, next) => {
    if (req?.header("Authorization") && req?.header("Authorization") !== "null") {
      ensureAuth(req, res, next);
    } else {
      next();
    }
  },
  getAllVideos
);
app.get("/referenceDetails", getReferenceDetails);
app.put(
  "/personalInfo",
  ensureAuth,
  Validator(validatePersonalInfo, "body"),
  candidateGenericController
);
app.put("/clear-partner", ensureAuth, clearPartnerEmail);
app.put("/aboutMe", ensureAuth, Validator(validateAboutMe, "body"), candidateGenericController);
app.put(
  "/skillsDriverLicense",
  ensureAuth,
  Validator(validateSkillsDriverLicense, "body"),
  candidateGenericController
);
app.put(
  "/availabilityInfo",
  ensureAuth,
  Validator(validateAvailabilityInfo, "body"),
  candidateGenericController
);
app.put("/resume", ensureAuth, Validator(validateResume, "body"), candidateGenericController);
app.put(
  "/diplomaCertifications",
  ensureAuth,
  Validator(validateDiplomaCertifications, "body"),
  candidateGenericController
);
app.put(
  "/references",
  ensureAuth,
  Validator(validateReferences, "body"),
  candidateGenericController
);
app.put(
  "/experience",
  ensureAuth,
  Validator(validateExperience, "body"),
  candidateGenericController
);
app.put("/uploads", ensureAuth, Validator(validateUpload, "body"), candidateGenericController);
app.put("/settings", Validator(validateSettings, "body"), ensureAuth, settings);
app.post(
  "/verifyReferences",
  Validator(validateVerifyReferencesQuery, "query"),
  Validator(validateVerifyReferencesBody, "body"),
  verifyReferences
);
app.get(
  "/requestPartnerVerification",
  Validator(validatePartnerEmail, "query"),
  requestPartnerVerification
);
app.get(
  "/partnerConfirmation",
  Validator(validatePartnerConfirmationQuery, "query"),
  partnerConfirmation
);
app.put("/profileLink", ensureAuth, updateProfileLink);

// app.get("/bulk-add-profile-link", bulkAddProfileLink);

module.exports = app;
