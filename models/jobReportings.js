"use-strict";
const mongoose = require("mongoose");

const JobReporting = new mongoose.Schema(
  {
    jobInfo: {
      img: String,
      jobId: Number,
      jobTitle: String,
      employerName: String,
      employerEmail: String,
      id: { type: mongoose.Types.ObjectId, ref: "jobs" },
    },
    reporterInfo: {
      email: String,
      fullName: String,
      shareLink: String,
      phoneNumber: String,
      id: { type: mongoose.Types.ObjectId, ref: "candidates" },
    },
    reason: { type: String },
    description: { type: String },
    evidence: { name: String, url: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobReporting", JobReporting);
