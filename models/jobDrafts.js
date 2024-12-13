"use-strict";
const mongoose = require("mongoose");

const JobDraft = new mongoose.Schema(
  {
    userId: String,
    jobCategory: String,
    jobTitle: String,
    jobId: { type: Number, unique: true },
    jobFilledStatus: Boolean,
    jobType: { type: String },
    employmentType: String,
    companyInfo: {
      companySize: Number,
      companyType: String,
      numOfHorses: Number,
      levelOfOperation: String,
      companyName: String,
    },
    positionInfo: {
      homeBase: {
        country: String,
        city: String,
        address: String,
      },
      currentlyLocated: {
        country: String,
        city: String,
      },
      competition: {
        country: [String],
        name: String,
      },
      salary: String,
      startDate: Date,
      currency: String,
      salaryBasis: String,
      aboutThePosition: String,
      aboutThePositionOtherLanguage: String,
      aboutThePositionOtherLanguageText: String,
      employeeExpectations: [String],
      liveIn: String,
      image: String,
    },
    preferredCandidate: {
      gender: String,
      languages: [{ name: String, fluency: String }],
      nationality: [String],
      visa: {
        visaType: [String],
      },
      availability: String,
      candidateCurrentlyBased: [String],
      professionalExperience: String,
      team: String,
      bringOwnHorse: String,
      bringOwnDog: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobDraft", JobDraft);
