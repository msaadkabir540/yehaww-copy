const express = require("express");

const {
  postJob,
  editJob,
  deleteJob,
  getJobById,
  getAllJobs,
  markAsFilled,
  jobInterviews,
  addCoverLetter,
  interviewVideos,
  getInterviewData,
  addCandidateNote,
  deleteApplication,
  getCandidateMyJobs,
  shortListCandidates,
  allAppliedCandidates,
  updateInterestedJobs,
  getAllJobsActivePosts,
  candidateJobInterviews,
} = require("../../controllers/job");
const { parseMiddleWare } = require("../../utils/helper");
const { ensureAuth, Validator } = require("../../middleware/ensure-auth");
const {
  validateJob,
  validateJobId,
  validateGetAllJobs,
  validateActivePosts,
  validateAddCoverLetter,
  validateAddCandidateNote,
  validateAppliedCandidates,
  validateInterviewQuestions,
  validateShortListedCandidates,
  validateShortListedCandidatesBody,
} = require("./validate");

const app = express.Router();

app.get(
  "/position/:id",
  (req, res, next) => {
    if (req?.header("Authorization") && req?.header("Authorization") !== "null") {
      ensureAuth(req, res, next);
    } else {
      next();
    }
  },
  getJobById
); // get a job by Id
app.get(
  "/position",
  (req, res, next) => parseMiddleWare(req, res, next, ["nationality", "candidateCurrentlyBased"]),
  Validator(validateGetAllJobs, "query"),
  (req, res, next) => {
    if (req?.header("Authorization") && req?.header("Authorization") !== "null") {
      ensureAuth(req, res, next);
    } else {
      next();
    }
  },
  getAllJobs
); //get all jobs
app.get("/candidateJobs", ensureAuth, getCandidateMyJobs); //all jobs marked as interested by candidate
app.get(
  "/jobsByEmployer",
  Validator(validateActivePosts, "query"),
  ensureAuth,
  getAllJobsActivePosts
); //all jobs posted by employer
app.delete("/delete-job/:id", ensureAuth, deleteJob); //job position deleted by employer
app.post("/position", Validator(validateJob, "body"), ensureAuth, postJob); //job position posted by employer
app.put("/position/:id", Validator(validateJob, "body"), ensureAuth, editJob); //job position update api by employer
app.put("/positionMarked/:id", ensureAuth, markAsFilled); //job position marked as filled update api by employer
app.put(
  "/shortListCandidates",
  Validator(validateShortListedCandidatesBody, "body"),
  ensureAuth,
  shortListCandidates
); //candidates shortlisted by employer
app.put("/interestedJobs", Validator(validateJobId, "body"), ensureAuth, updateInterestedJobs); //jobs marked as interested by candidate
app.put(
  "/jobInterviews",
  // Validator(validateInterviewQuestions, "query"),
  // (req, res, next) => parseMiddleWare(req, res, next, ["videoInterviewRequest"]),
  Validator(validateInterviewQuestions, "body"),
  ensureAuth,
  jobInterviews
); //employer jobInterview
app.put("/addCoverLetter", ensureAuth, Validator(validateAddCoverLetter, "body"), addCoverLetter); //candidate add cover letter to interested job
app.put(
  "/addCandidateNote",
  ensureAuth,
  Validator(validateAddCandidateNote, "body"),
  addCandidateNote
); //candidate add candidate note to interested job
app.put("/myJobInterviews", ensureAuth, candidateJobInterviews); //candidate jobInterview (upload video)
app.get(
  "/allAppliedCandidates",
  (req, res, next) =>
    parseMiddleWare(req, res, next, [
      "teamCouple",
      "verified",
      "video",
      // "nationalities",
      // "experienceLevelName",
      // "qualifications",
    ]),
  Validator(validateAppliedCandidates, "query"),
  ensureAuth,
  allAppliedCandidates
);
app.get("/myVideoInterviews", ensureAuth, interviewVideos);
app.delete("/removeApplication", ensureAuth, deleteApplication);
app.get("/getInterviewData/:jobId", ensureAuth, getInterviewData);

module.exports = app;
