const Joi = require("joi");
const moment = require("moment");

const noneToHigh = ["None", "Low", "Average", "High"];
const experienceLevelOptions = ["None", "Little", "Some", "Considerable", "Extensive"];
const experienceTypes = ["Professional", "Amateur", "Hobby"];

const employmentTypes = [
  "Any",
  "Permanent Position",
  "Seasonal",
  "Temporary",
  "Freelance",
  "Volunteer",
];

const referenceTypes = ["Barn", "Rider", "Owner", "Stable manager", "Recruitment agency", "Other"];
const levelOfOperationOptions = [
  "Hobby Barn",
  "Young Horse Barn",
  "Amateur Barn",
  "Professional Barn",
];
const experienceDurationOptions = [
  "0 - 6 months",
  "0.5 - 1 year",
  "1 - 2 years",
  "2 - 5 years",
  "5+ years",
  "10+ years",
];
const availabilityOptions = [
  "Immediately",
  "Within 2 weeks",
  "2-4 weeks",
  "4-6 weeks",
  "6 + weeks",
  "Unknown",
  "Unavailable",
];
const visaOptions = [
  "Green Card / US resident",
  "B1/B2",
  "European Visa / Schengen Visa",
  "European Visa & UK residents",
  "UK work Visa",
  "American Work Visa",
  "Other Visa",
];
const educationOptions = [
  "Less than high school diploma",
  "High school diploma or GED",
  "Some college, but no degree",
  "Associates Degree (for example: AA, AS)",
  "Bachelor's Degree (for example: BA, BBA, and BS)",
  "Master's Degree (for example: MA, MS, and MEng)",
  "Professional Degree (for example: MD, DDS, JD)",
  "Doctorate (for example: PhD, EdD)",
];
const generalExperiences = [
  "Professional Equine Experience",
  "Sale & Marketing",
  "Financial Accounting",
  "Equine Consulting",
  "Project Management",
  "Technology (IT)",
  "Human resources & Payroll (HR)",
  "Legal",
  "Staff Training",
  "Insurance",
  "Investigation",
  "Administrative",
  "Horse Broker",
  "Equine Real Estate Agent",
  "Technical & Compliance",
];
const disciplines = [
  "Barrel Racing",
  "Combined Driving",
  "Dressage",
  "Endurance",
  "Eventing",
  "Jumping",
  "Para-Equestrian",
  "Reining",
  "Vaulting",
  "English Pleasure",
  "Carriage Pleasure Driving ",
  "Hunter",
  "Hunter/ Jumping Seat Equitation",
  "Parade Horse",
  "Polo",
  "Racing",
  "Roadster",
  "Saddle Seat",
  "Western",
  "Western Dressage",
  "Western / Reining Seat Equitation",
];
const skills = [
  "clipping",
  "longing",
  "longReining",
  "handlingStallion",
  "handlingYoungHorses",
  "exerciseRiding",
  "hacking",
  "breakingIn",
  "FEIExperience",
  "teaching",
  "braiding",
  "bandaging",
  "carriageDriving",
  "jumpSchool",
  "courseBuilding",
  "barnManagement",
  "eventManagement",
  "equineFirstAid",
  "travelWithHorses",
  "logisticsPlanning",
  "transportingHorses",
  "entries",
  "equinePaperwork",
  "championship",
  "sales",
  "computerSkills",
  "marketing",
  "socialMedia",
];
const experienceLevel = [
  "Dressage",
  "Endurance",
  "Eventing",
  "Jumping",
  "Para-Equestrian",
  "Reining",
  "Vaulting",
  "English pleasure",
  "Carriage Driving",
  "Hunter",
  "Hunter/Jumping seat Equitation",
  "Parade Horse",
  "Polo",
  "Racing",
  "Western",
  "Western Dressage",
  "Western/Reining Seat Equitation",
  "Barn & facility Manager",
  "Equine Therapist",
  "Equine Dental Technician",
  "Equine Nutritionist",
  "Equine Rehabilitation Therapist",
  "Equine Veterinarian",
  "Equine Veterinarian Technician",
  "Broodmare Manager",
  "Riding Instructor",
  "Judge",
  "Show Jumping Course Designer",
  "Blacksmith/Farrier",
  "Exercise Rider",
  "Show Preparation",
  "Farm or Ranch Manager",
  "Equine Association Staff Member",
  "Equine Insurance Agent",
  "Equine Product Sales Representative",
  "Show Manager",
  "Event/Competition Promoter",
  "Clipping",
  "Children's Camp",
  "Foal Weaning",
  "Horse Transport",
  "Riding School",
  "Saddlery / Tack Store",
  "Stallion Service",
  "Trail Riding / Trekking Center",
  "Training Film / Movie",
  "Photography",
];
const gender = ["Male", "Female", "Rather Not Describe"];

const base64PdfPattern = new RegExp(/^data:application\/(pdf);base64,([^\"]*)$/);
const urlPattern = new RegExp(
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/
);
const ddmmyyyDatePattern = new RegExp(
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
);

const validateExpiryDate = (value, helpers) => {
  const expiryDate = moment(value).format("YYYY-MM-DD");
  const today = moment().format("YYYY-MM-DD");
  if (expiryDate < today) {
    return helpers.message("Please enter a valid Expiry Date");
  }
  return value;
};

const validateRequiredInteger = Joi.number().integer().min(1).required();
const validateOptionalString = Joi.string().optional();
const validateRequiredDate = Joi.date().required();
const validateRequiredString = Joi.string().required();
const validatePattern = (pattern, required = true) =>
  Joi.string().pattern(pattern)[required ? `required` : `optional`]();
const validateYesNo = (required = true) =>
  Joi.string().valid("Yes", "No")[required ? `required` : `optional`]();
const validateExperience = Joi.string()
  .valid("None", "Novice", "Experienced", "Very Good", "Proficient")
  .required();
const validateValidStringArr = (arr, required = true) =>
  Joi.string()
    .valid(...arr)
    [required ? `required` : `optional`]();

module.exports = {
  skills,
  gender,
  noneToHigh,
  urlPattern,
  visaOptions,
  disciplines,
  validateYesNo,
  validateYesNo,
  referenceTypes,
  experienceLevel,
  validatePattern,
  validatePattern,
  employmentTypes,
  experienceTypes,
  educationOptions,
  base64PdfPattern,
  validateExpiryDate,
  generalExperiences,
  validateExperience,
  ddmmyyyDatePattern,
  validateExperience,
  availabilityOptions,
  validateRequiredDate,
  experienceLevelOptions,
  validateRequiredString,
  validateValidStringArr,
  experienceLevelOptions,
  levelOfOperationOptions,
  levelOfOperationOptions,
  experienceDurationOptions,
  experienceDurationOptions,
  validateRequiredInteger,
  validateOptionalString,
};
