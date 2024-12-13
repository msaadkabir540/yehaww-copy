const ObjectId = require("mongoose").Types.ObjectId;

const Job = require("../../models/jobs");
const User = require("../../models/users");
const Candidates = require("../../models/candidates");
const JobReporting = require("../../models/jobReportings");

const { mailer, checkValidFileTypes, uploadPDFToS3 } = require("../../utils/helper");
const { jobReportAlertEmail } = require("./helper");

const addjobReport = async (req, res) => {
  let evidenceURL;
  const { jobId, reason, description, evidence, candidateId, type, evidenceName } = req.body;

  if (type === "employer") {
    return res.status(400).json({ msg: "Employer Is not allowed to report a job!" });
  }

  if (evidence) {
    const checkedFile = checkValidFileTypes({
      base64: evidence,
      validFileTypes: ["jpg", "jpeg", "png", "mp4", "mov", "avi", "quicktime", "wmv", "flv"],
    });

    if (evidence && !checkedFile.valid) {
      throw new Error("Invalid File Types!");
    }

    const buf = Buffer.from(
      evidence
        .replace("data:image/png;base64,", "")
        .replace("data:image/jpg;base64,", "")
        .replace("data:image/jpeg;base64,", ""),
      "base64"
    );

    evidenceURL = await uploadPDFToS3({
      key: `${Math.floor(Math.random() * 10000000000000)}-${candidateId}-report-job-evidence`,
      ContentType: checkedFile.type,
      buf,
    });
  } else if (evidence === "") {
    evidenceURL = null;
  }

  const jobFound = await Job.findById(jobId);
  if (!jobFound) {
    return res.status(404).json({ msg: "Job not found!" });
  }

  const reporter = await Candidates.findById(candidateId);
  if (!reporter) {
    return res.status(404).json({ msg: "Reporter not found!" });
  }

  const { firstName, lastName, email, phoneNumber } = reporter.personalInfo.contactDetail;

  const userFound = await User.findById(jobFound?.userId);

  const jobInfo = {
    jobId: jobFound?.jobId,
    id: new ObjectId(jobId),
    jobTitle: jobFound?.jobTitle,
    img: jobFound?.positionInfo?.image,
    employerEmail: userFound?.email || "N/A",
    employerName: userFound ? `${userFound?.forename} ${userFound?.surname}` : "N/A",
  };

  const reporterInfo = {
    email,
    phoneNumber,
    id: new ObjectId(candidateId),
    fullName: `${firstName} ${lastName}`,
    shareLink: `${process.env.DOMAIN}/u/${reporter?.profileLinkId}`,
  };

  const data = {
    reason,
    jobInfo,
    description,
    reporterInfo,
    evidence: { name: evidenceName, url: evidenceURL },
  };

  const report = await JobReporting.create(data);

  if (report) {
    const mailData = {
      reason,
      description,
      jobId: report?.jobInfo?.jobId,
      jobTitle: report?.jobInfo?.jobTitle,
      reporterEmail: report?.reporterInfo?.email,
      employerName: report?.jobInfo?.employerName,
      reporterName: report?.reporterInfo?.fullName,
      employerEmail: report?.jobInfo?.employerEmail,
      reporterPhone: report?.reporterInfo?.phoneNumber,
      jobLink: `${process.env.DOMAIN}/jobs/details/${jobId}`,
    };

    await mailer({
      to: "aizaamir8@gmail.com",
      // to: process.env.MAILGUN_INFO_MAIL,
      subject: `Job Report Alert!`,
      html: jobReportAlertEmail({ ...mailData }),
    });
  }

  return res
    .status(200)
    .json({ report, msg: "This job has been reported, soon Yehaww team will investigate this." });
};

module.exports = { addjobReport };
