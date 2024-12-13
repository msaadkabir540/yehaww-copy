const express = require("express");

const {
  postDraft,
  editDraft,
  deleteDraft,
  getDraftById,
  jobDraftByEmployer,
} = require("../../controllers/job-draft");
const { validateDraft, validateDraftByEmployer } = require("./validate");
const { ensureAuth, Validator } = require("../../middleware/ensure-auth");

const app = express.Router();

app.get("/draft/:id", getDraftById);
app.get(
  "/jobDraftByEmployer",
  Validator(validateDraftByEmployer, "query"),
  ensureAuth,
  jobDraftByEmployer
);
app.delete("/delete-draft/:id", ensureAuth, deleteDraft);
app.post("/draft", Validator(validateDraft, "body"), ensureAuth, postDraft);
app.put("/draft/:id", Validator(validateDraft, "body"), ensureAuth, editDraft);

module.exports = app;
