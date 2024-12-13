"use-strict";
const mongoose = require("mongoose");

const Employer = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  referral: { type: String },
  signUpReferral: {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    availed: { type: Boolean, default: false },
  },
  referralUsers: [
    {
      user: { type: mongoose.Types.ObjectId, ref: "users" },
      signedUpAt: Date,
      availed: { type: Boolean, default: false },
    },
  ],
  emailAlerts: { type: Boolean },
  shortListedCandidates: { type: Boolean },
  personalDetails: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    companyName: { type: String },
    numberOfHorses: { type: Number },
    businessAddress: { type: String },
    phoneNumber: { type: String },
    profilePicture: { type: String },
  },
});
module.exports = mongoose.model("Employer", Employer);
