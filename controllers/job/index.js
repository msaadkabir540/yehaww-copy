const fs = require("fs");
const cron = require("cron");
const moment = require("moment");
const mongoose = require("mongoose").Types.ObjectId;
const Job = require("../../models/jobs");
const User = require("../../models/users");
const Employer = require("../../models/employers");
const jobAlerts = require("../../models/jobAlerts");
const Candidate = require("../../models/candidates");
const InterestedJob = require("../../models/interestedJobs");

const { handleJobMapping } = require("../dashboard/helper");
const { uploadBufS3Wrapper, mailer } = require("../../utils/helper");
const {
  uploadFile,
  deleteImage,
  validateCity,
  salaryOptions,
  emailAlertTemplate,
  expiryAlertTemplate,
  handleSingleJobMapping,
  candidateAcknowledgeEmail,
} = require("./helper");
const { stayCleanPositions, genderOptions, newPositionArr } = require("../../utils/arrayHelper");
const { object } = require("joi");

const getJobById = async (req, res) => {
  let interestedJobIds = [];
  const jobId = req.params.id;
  const { _id, type } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(409).send({ msg: "Job not found" });
  }

  if (type === "candidate") {
    interestedJobIds = await InterestedJob.find(
      { userId: _id, applicationRemoved: false },
      "-_id jobId"
    );
    interestedJobIds = interestedJobIds.map((x) => x?.jobId?.toString());
  }
  const candidateCount = await Job.aggregate([
    {
      $match: {
        _id: job._id,
      },
    },
    {
      $lookup: {
        from: "interestedjobs",
        localField: "_id",
        foreignField: "jobId",
        as: "jobDetails",
      },
    },
    {
      $project: {
        appliedCandidates: { $size: "$jobDetails" },
      },
    },
  ]);

  const { appliedCandidates } = candidateCount[0];
  const newJob = { ...job.toObject(), appliedCandidates };
  res.status(200).send(handleSingleJobMapping(newJob, interestedJobIds));
};

const getAllJobs = async (req, res) => {
  let interestedJobIds = [];
  const {
    page,
    visa,
    team,
    gender,
    sortBy,
    salary,
    liveIn,
    jobType,
    mapView,
    position,
    category,
    pageSize,
    currency,
    properties,
    companyName,
    companyType,
    nationality,
    companySize,
    availability,
    employmentType,
    homeBaseCountry,
    levelOfOperation,
    professionalExperience,
    currentlyLocatedCountry,
    candidateCurrentlyBased,
  } = req.query;

  const { _id, type } = req.body;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const query = {
    ...(position && { jobTitle: new RegExp(position, "i") }),
    ...(category && { jobCategory: new RegExp(category, "i") }),
    ...(jobType && { jobType }),
    ...(employmentType && { employmentType }),
    ...(companyType && { "companyInfo.companyType": companyType }),
    ...(companyName && { "companyInfo.companyName": companyName }),
    ...(companySize && { "companyInfo.companySize": companySize }),
    ...(levelOfOperation && { "companyInfo.levelOfOperation": levelOfOperation }),
    ...(homeBaseCountry && { "positionInfo.homeBase.country": homeBaseCountry }),
    ...(currentlyLocatedCountry && {
      "positionInfo.currentlyLocated.country": currentlyLocatedCountry,
    }),
    ...(liveIn && { "positionInfo.liveIn": liveIn }),
    ...(currency && { "positionInfo.currency": currency }),
    ...(salary && {
      "positionInfo.salary": {
        $gte: salaryOptions[salary].min,
        ...(salaryOptions[salary].max && { $lte: salaryOptions[salary].max }),
      },
    }),
    ...(gender && { "preferredCandidate.gender": gender }),
    ...(visa && { "preferredCandidate.visa.visaType": visa }),
    ...(availability && { "preferredCandidate.availability": availability }),
    ...(professionalExperience && {
      "preferredCandidate.professionalExperience": professionalExperience,
    }),
    ...(team && { "preferredCandidate.team": team }),
    ...(nationality && {
      $or: nationality.map((x) => {
        return {
          "preferredCandidate.nationality": x,
        };
      }),
    }),
    ...(candidateCurrentlyBased && {
      $or: candidateCurrentlyBased.map((x) => {
        return {
          "preferredCandidate.candidateCurrentlyBased": x,
        };
      }),
    }),
    $or: [
      { jobFilledStatus: true },
      {
        $and: [{ jobFilledStatus: false }, { updatedAt: { $gte: thirtyDaysAgo } }],
      },
    ],
  };

  if (type === "candidate") {
    interestedJobIds = await InterestedJob.find(
      { userId: _id, applicationRemoved: false },
      "-_id jobId"
    );
    interestedJobIds = interestedJobIds.map((x) => x.jobId?.valueOf());
  }

  const jobs = handleJobMapping(
    await Job.find(query, properties)
      .sort({
        ...(sortBy === "latest" && { createdAt: -1 }),
        ...(sortBy === "startDate" && { "positionInfo.startDate": 1 }),
        ...(sortBy === "salary" && { "positionInfo.salary": -1 }),
      })
      .skip(pageSize * page)
      .limit(pageSize),
    interestedJobIds,
    mapView
  );
  const jobsCount = await Job.find(query).count();

  if (jobsCount === 0) return res.status(200).send({ jobs: [], jobsCount: 0 });
  return res.status(200).send({ jobs, jobsCount });
};

const postJob = async (req, res) => {
  const userId = req.body._id;
  const { job } = req.body;
  const {
    job: {
      positionInfo: { image, homeBase, currentlyLocated },
    },
  } = req.body;

  const employer = await Employer.findOne({ userId });

  // validate home base city
  if (homeBase?.city) {
    validateCity(homeBase?.country, homeBase?.city);
  }

  // validate Currently Located city
  if (currentlyLocated?.city) {
    validateCity(currentlyLocated?.country, currentlyLocated?.city);
  }

  stayCleanPositions.includes(job.jobTitle)
    ? (job.jobType = "Stay Clean")
    : (job.jobType = "Hands On");

  const user = await User.findById(userId);
  if (!user) {
    return res.status(409).send({ msg: "User does not exists" });
  }
  if (user.type != "employer") {
    return res.status(409).send({ msg: "User is not an employer" });
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString().slice(-2);
  const currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);

  const highestJob = await Job.findOne(
    {
      createdAt: {
        $gte: moment(currentDate).startOf("month").toDate(),
        $lt: moment(currentDate).endOf("month").toDate(),
      },
    },
    { jobId: 1 }
  )
    .sort({ jobId: -1 })
    .limit(1);

  const highestJobId = highestJob ? highestJob.jobId : 0;
  const jobCount = highestJobId;

  const incrementedJobCount = jobCount + 1;
  const paddedJobCount = ("0" + incrementedJobCount).slice(-2);

  const jobId = currentMonth + currentYear + paddedJobCount;

  job.jobId = jobId;
  job.jobFilledStatus = false;

  if (typeof job.positionInfo?.image === object) {
    job.positionInfo.image = "";
  }

  if (
    job?.positionInfo?.image &&
    job.positionInfo?.image?.startsWith?.("https://yehaww-bucket") === false
  ) {
    job.positionInfo.image = await uploadFile({ image, jobId: job.jobId, userId });
  }

  const updatedJob = new Job({
    userId,
    ...job,
  });
  await updatedJob.save();

  const filter = {
    positions: job.jobTitle,
  };
  const candidateAlert = await jobAlerts.find(filter, "-_id userId");
  const emails = candidateAlert.map((x) => x.userId);
  const candidateContactDetail = await Candidate.find(
    { emailAlerts: true, userId: { $in: emails } },
    "-_id personalInfo.contactDetail"
  );
  const candidateFirstName = candidateContactDetail.map(
    (x) => x.personalInfo.contactDetail.firstName
  );
  const candidateLastName = candidateContactDetail.map(
    (x) => x.personalInfo.contactDetail.lastName
  );

  const jobAlertEmails = candidateContactDetail.map((x) => x.personalInfo.contactDetail.email);

  const mails = jobAlertEmails.length
    ? jobAlertEmails.map(async (x, index) => {
        return await mailer({
          to: x,
          subject: `The right job for you!`,
          html: `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="utf-8" />

    <meta name="viewport" content="width=device-width" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="x-apple-disable-message-reformatting" />

    <title></title>
    <link
      href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700"
      rel="stylesheet"
    />
    <style>
      html,
      body {
        margin: 0 auto;
        padding: 0;
        height: 100vh;
        width: 100%;
        background: #ebe8e2;
        font-family: "Poppins", sans-serif;
      }

      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
        text-decoration: none;
      }
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }

      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }

      img {
        -ms-interpolation-mode: bicubic;
      }

      *[x-apple-data-detectors],
      .unstyle-auto-detected-links *,
      .aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      .a6S {
        display: none !important;
        opacity: 0.01 !important;
      }

      .im {
        color: inherit !important;
      }

      img.g-img + div {
        display: none !important;
      }
      .heading1 {
        font-size: 29px;
        font-weight: 400;
        color: #424b49;
      }
      .spanClass {
        font-weight: 600;
        font-size: 29px;

        color: #424b49;
      }
      .imgLogo {
        width: 310px;
      }
      .img1 {
        height: 40px;
        width: 40px;
        margin-right: 15px;
      }
      .footerP {
        font-size: 16px;
        color: #424b49;
        font-weight: 400;
      }
      .middleBg {
        background-color: #ffffff;
        border-radius: 7px;
        padding: 40px 20px;
        margin: 0px 30px;
      }
      .imgDiv {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .innerImg {
        width: 140px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      .centerTopText {
        color: #252525;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        margin-top: 20px;
      }
      .welcomeSpan {
        color: #b19e85;
        font-size: 18px;
        font-weight: 600;
      }
      .borderDiv {
        border-bottom: 1px solid #e6e6ea;
        max-width: 300px;
        margin: 20px auto;
      }
      .textClass {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
        margin-top: 20px;
      }
      .textClassSmall {
        font-size: 16px;
      }
      .textClassNoMargin {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
      }
      .disclaimer {
        color: #252525;
        font-size: 12px;
        font-weight: 400;
      }
      .applyBtn {
        border: none;
        font-size: 18px;
        color: #ffffff;
        font-weight: 400;
        padding: 20px 40px;
        border-radius: 12px;
        background-color: #b19d83;
        cursor: pointer;
      }
      .applyBtn:hover {
        background-color: #a0896b;
      }
      .aTag {
        color: #252525;
        font-weight: 600;
      }
      .li{
        margin-left: 20px;
      }
    </style>
  </head>
  <body width="100%" style="mso-line-height-rule: exactly; padding: 30px 20px">
    <div style="max-width: 800px; margin: 0 auto; width: 100%; background: #ebe8e2">
      <!-- BEGIN BODY -->
      <table
        align="center"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        width="100%"
        height="100vh"
        style="margin: auto"
      >
        <tr>
          <td valign="top">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="text-align: center">
                  <a href="https://www.yehaww.com" style="display: inline-flex"
                    ><img
                      src="${process.env.DOMAIN_API}/Images/site-logo.png"
                      class="imgLogo"
                  /></a>
                  <h1 class="heading1">
                    Dear
                    <span class="spanClass">
                      ${candidateFirstName[index]} ${candidateLastName[index]},
                    </span>
                  </h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- center tr -->
        <tr>
          <td valign="middle" style="padding-top: 30px">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <div class="middleBg">
                    <div class="imgDiv">
                      <img
                        src="${process.env.DOMAIN_API}/Images/tv.png"
                        alt=""
                        class="innerImg"
                      />
                    </div>
                    <div class="borderDiv"></div>
                    <p class="textClass">
                      We are happy to inform you that a job that matches your preferences in your
                      profile is now on Yehaww.com
                    </p>
                    <p class="textClass">
                      An opportunity as ${job.jobTitle} has been posted by ${
            employer.personalDetails.firstName
          } ${employer.personalDetails.lastName}.
                    </p>
                    <p class="textClass">The post offers:</p>
                    <ul>
                      <li class="li">
                        ${
                          job.employmentType.includes("Position")
                            ? job.employmentType
                            : `${job.employmentType} Position`
                        }
                      </li>
                      <li class="li">
                        Expected starting date ${moment(job.positionInfo.startDate).format(
                          "Do MMM YYYY"
                        )}
                      </li>
                    </ul>
                    <h4 class="textClass">About:</h4>
                    <p class="textClassSmall">${job.positionInfo.aboutThePosition}</p>
                    <p class="textClass">
                      To see the full post on Yehaww.com and start your new adventure today.
                    </p>
                    <a href=${`${process.env.DOMAIN}/jobs/details/${updatedJob._id.toString()}`}
                    target="_blank">
                    <button class="applyBtn">Apply Here</button>
                    </a>
                    <p class="textClass">
                      (This email was sent to you automatically and can not be replied to).
                    </p>
                    <p class="textClass" style="margin-bottom: 10px">
                      To disable “Job alerts” sign in to your Yehaww account and change the settings
                      in your profile.
                    </p>
                    <p class="disclaimer">
                      Disclaimer: Yehaww LLC assumes no responsibility or liability for any content
                      on the website www.yehaww.com posted by users or members. The information,
                      data and text that has been submitted, posted, displayed or distributed on our
                      site or through our services is entirely the responsibility of our members and
                      users on the website. NEVER apply for a position directly via email, ONLY
                      through the website
                      <a href="${process.env.DOMAIN}/" target="_blank">www.yehaww.com</a>
                      In connection with employment and any agreement entered between employers or
                      providers and candidates, users agree to conduct all necessary due diligence.
                      The information on this website is provided on an “as is” basis with no given
                      representation or guarantees by Yehaww LLC, as to the performance,
                      suitability, entitlement or character of any employer, candidate, user or
                      position posted on
                    </p>
                    <a href="${process.env.DOMAIN}/" target="_blank">www.yehaww.com</a>
                    <br />
                    <br />
                    <p class="textClassNoMargin">Best regards</p>
                    <p class="textClassNoMargin">The Yehaww Team</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- end tr -->
        <tr>
          <td valign="top" style="padding-top: 30px">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="text-align: center">
                  <a href="https://www.facebook.com/profile.php?id=100083581836008" target="_blank">
                    <img
                      src="${process.env.DOMAIN_API}/Images/facebook.png"
                      class="img1"
                    />
                  </a>
                  <a href="https://www.instagram.com/yehaww_com/" target="_blank">
                    <img
                      src="${process.env.DOMAIN_API}/Images/insta.svg"
                      class="img1"
                    />
                  </a>
                  <a href="https://www.linkedin.com/company/yehaww/" target="_blank">
                    <img
                      src="${process.env.DOMAIN_API}/Images/Linkdin.svg"
                      class="img1"
                      style="margin-right: 0px"
                    />
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="text-align: center; padding: 30px 0px">
                    <p class="footerP">Yehaww LLC</p>
                    <p class="footerP">
                      <a href="mailto:info@yehaww.com" target="_blank"> info@yehaww.com </a>
                      |
                      <a href="https://www.yehaww.com/" target="_blank"> yehaww.com </a>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`,
        });
      })
    : [];

  await Promise.all(mails);

  return res.status(200).send({ msg: "Job Posted Successfully" });
};

const deleteJob = async (req, res) => {
  const { _id, type } = req.body;
  const jobObjectId = req.params.id;

  if (type != "employer")
    return res.status(409).send({ msg: "Only employers are allowed to delete posts." });

  const job = await Job.findOne({ _id: jobObjectId, userId: _id });
  if (!job) return res.status(409).send({ msg: "Job not found or Invalid Job Id" });

  const deleteJobPosition = await Job.deleteOne({ _id: jobObjectId });
  if (!deleteJobPosition.deletedCount) {
    return res.status(500).send("Delete Job Failed");
  }
  deleteImage({ jobId: job.jobId, userId: _id });
  res.status(200).send({ msg: "Job Deleted Successfully" });
};

// redundant now
const addCoverLetter = async (req, res) => {
  const { _id, type, jobId, coverLetter } = req.body;

  if (type !== "candidate")
    return res.status(409).send({ msg: "Only candidate are allowed to add cover letter." });

  const job = await InterestedJob.findOne({ userId: _id, jobId });
  if (!job) return res.status(409).send({ msg: "Invalid Job Id" });

  const updatedInterestedJob = await InterestedJob.updateOne(
    { userId: _id, jobId },
    {
      coverLetter,
    }
  );
  if (!updatedInterestedJob.acknowledged)
    return res.status(409).send({ msg: "Failed to Update Cover Letter!" });

  res.status(200).send({ msg: "Cover Letter Added Successfully" });
};

const addCandidateNote = async (req, res) => {
  const { candidateId, type, jobId, candidateNote } = req.body;

  if (type !== "employer")
    return res.status(409).send({ msg: "Only Employers are allowed to Add Candidate Note!" });

  const interestedJob = await InterestedJob.findOne({ userId: candidateId, jobId });
  if (!interestedJob) return res.status(409).send({ msg: "Interested Job does not exist!" });

  const updatedInterestedJob = await InterestedJob.updateOne(
    { jobId },
    {
      candidateNote,
    }
  );
  if (!updatedInterestedJob.acknowledged)
    return res.status(409).send({ msg: "Failed to Update Candidate Note!" });

  res.status(200).send({ msg: "Candidate Note Added Successfully" });
};

const editJob = async (req, res) => {
  const userId = req.body._id;
  const jobId = req.params.id;
  const { job } = req.body;
  const {
    job: {
      positionInfo: { image },
    },
  } = req.body;

  if (req.body.type !== "employer") {
    return res.status(409).send({ msg: "User is not an employer" });
  }

  const jobFound = await Job.findOne({ _id: jobId, userId });
  if (!jobFound) return res.status(409).send({ msg: "Job not found or Invalid Job Id" });

  if (image != jobFound.positionInfo.image) {
    if (!image.startsWith("https://yehaww-bucket")) {
      if (job.positionInfo.image === "") {
        job.positionInfo.image = "";
      } else {
        job.positionInfo.image = await uploadFile({
          image,
          jobId: jobFound.jobId,
          userId,
        });
      }
    }
  }
  const updatedJob = await Job.updateOne(
    { _id: jobId, userId },
    {
      ...job,
    }
  );
  if (!updatedJob.acknowledged) return res.status(409).send({ msg: "Job Update Failed" });

  return res.status(200).send({ msg: "Job Updated Successfully" });
};

const markAsFilled = async (req, res) => {
  const { _id, type } = req.body;
  const jobObjectId = req.params.id;

  if (type !== "employer")
    return res.status(409).send({ msg: "Only employers are allowed to delete posts." });

  const job = await Job.findOne({ _id: jobObjectId, userId: _id });
  if (!job) return res.status(409).send({ msg: "Job not found." });

  job.jobFilledStatus = !job.jobFilledStatus;
  const updatedStatus = await Job.findOneAndUpdate(
    { _id: jobObjectId },
    {
      ...job,
    },
    {
      upsert: true,
      new: true,
    }
  );
  await updatedStatus.save();

  return res.status(200).send({
    msg: updatedStatus.jobFilledStatus
      ? "Job Marked as filled Successfully"
      : "Job Marked as unfilled Successfully",
  });
};

const getAllJobsActivePosts = async (req, res) => {
  const { properties, pageSize, page } = req.query;
  let { sortBy } = req.query;
  const { _id, type } = req.body;

  if (type !== "employer")
    return res.status(409).send({ msg: "Only employers are allowed to view active posts." });

  if (sortBy === "createdAt") {
    sortBy = { createdAt: -1 };
  }

  let jobs = await Job.find({ userId: _id }, properties)
    .sort(sortBy)
    .skip(pageSize * page)
    .limit(pageSize);
  const jobsCount = await Job.find({ userId: _id }).count();
  if (jobsCount === 0) return res.status(409).send({ msg: "No Jobs Found." });

  const perJobsCount = await Job.aggregate([
    {
      $match: {
        _id: {
          $in: jobs.map((x) => x._id),
        },
      },
    },
    {
      $lookup: {
        from: "interestedjobs",
        localField: "_id",
        foreignField: "jobId",
        as: "jobDetails",
      },
    },
    {
      $project: {
        appliedCandidates: { $size: "$jobDetails" },
      },
    },
  ]);

  jobs = jobs.map((jobs) => {
    const {
      _id,
      jobId,
      jobTitle,
      createdAt,
      updatedAt,
      companyInfo,
      positionInfo,
      jobFilledStatus,
    } = jobs;

    const now = moment.utc();
    const startDate = moment(updatedAt).format("YYYY-MM-DD");
    const daysRemaining = moment(startDate).diff(now, "days") + 30;
    const daysRemainingString = daysRemaining <= 0 ? "Expired" : `${daysRemaining} Days Remaining`;
    return {
      _id,
      jobTitle,
      jobFilledStatus,
      image: positionInfo?.image,
      companyType: companyInfo?.companyType,
      list: [
        `Job ID # ${jobId}`,
        `${moment(new Date(createdAt)).format("Do MMMM YYYY")}`,
        daysRemainingString,
      ],
      appliedCandidates: perJobsCount.find((y) => y?._id.valueOf() === _id?.valueOf())
        ?.appliedCandidates,
    };
  });

  if (sortBy === "daysRemaining") {
    jobs.sort((a, b) => {
      const aDaysRemaining = parseInt(a.list[2]);
      const bDaysRemaining = parseInt(b.list[2]);

      if (a.list[2] === "Expired" && b.list[2] === "Expired") {
        return 0;
      } else if (a.list[2] === "Expired") {
        return 1;
      } else if (b.list[2] === "Expired") {
        return -1;
      } else {
        return bDaysRemaining - aDaysRemaining;
      }
    });
  }

  return res.status(200).send({ jobs, jobsCount });
};

const updateInterestedJobs = async (req, res) => {
  const { _id, type } = req.body;
  const { jobId, interested, coverLetter } = req.body;

  if (type !== "candidate")
    return res.status(409).send({ msg: "Only Candidates Are Allowed To Mark Jobs As Interested!" });

  const job = await Job.findById(jobId);
  if (!job) return res.status(409).send({ msg: "Invalid Job Id!" });

  const interestedJobExists = await InterestedJob.findOne({ jobId, userId: _id });

  const candidate = await Candidate.findOne({ userId: _id }).select("profileCompletion");

  const experience = await Candidate.findOne({ userId: _id }).select("experience");

  const profileStatuses = await Candidate.findOne({ userId: _id }).select("profileStatuses");

  const incompleteProfileStatuses = [0, 1, 2, 8].filter(
    (index) => !profileStatuses.profileStatuses[index]
  );

  if (incompleteProfileStatuses.length) {
    return res.status(409).send({
      msg: [
        "Please complete the following sections to apply for the job:",
        "1. Personal Information",
        "2. About Me",
        "3. Availability",
        "4. Experience",
        "5. Profile Picture",
      ],
    });
  }
  if (!experience.experience.generalExperience?.find((x) => x.duration)) {
    return res.status(409).send({
      msg: [
        "Please complete the following sections to apply for the job:",
        "1. Personal Information",
        "2. About Me",
        "3. Availability",
        "4. Experience",
        "5. Profile Picture",
      ],
    });
  }

  if (candidate.profileCompletion !== 100 && candidate.resume) {
    return res.status(409).send({
      msg: [
        "Please complete the following sections to apply for the job:",
        "1. Personal Information",
        "2. About Me",
        "3. Availability",
        "4. Experience",
        "5. Profile Picture",
      ],
    });
  }

  if (interested === false && interestedJobExists) {
    await InterestedJob.findOneAndUpdate({ jobId, userId: _id }, { applicationRemoved: true });
    return res.status(200).send({ msg: "Job Application Removed!" });
  }

  if (interested) {
    if (interested && interestedJobExists?.applicationRemoved) {
      await InterestedJob.findOneAndUpdate(
        { jobId, userId: _id },
        { coverLetter, applicationRemoved: false }
      );
      return res.status(200).send({ msg: "Job Added back to Interested Jobs" });
    }

    //condition checking if not already in interested jobs, add it.
    if (!interestedJobExists) {
      const dateNow = moment().toDate();
      const updatedInterestedJob = new InterestedJob({
        userId: _id,
        jobId: new mongoose(jobId),
        jobTitle: job.jobTitle,
        companyName: job.companyInfo.companyName,
        companyImage: job.positionInfo.image,
        coverLetter,
        applicationRemoved: false,
        dateApplied: dateNow,
        jobPostedByEmployerId: job.userId,
      });
      await updatedInterestedJob.save();

      const applicant = await Candidate.findOne({ userId: _id });
      const employer = await Employer.findOne({ userId: job?.userId });

      const employerName = `${employer?.personalDetails?.firstName} ${employer?.personalDetails?.lastName}`;
      const applicantName = `${applicant.personalInfo.contactDetail.firstName} ${applicant.personalInfo.contactDetail.lastName}`;

      const mailData = {
        jobId,
        applicantName,
        jobNo: job?.jobId,
        jobTitle: job?.jobTitle,
        jobTitle: job?.jobTitle,
        jobImg: job?.positionInfo?.image,
      };

      if (employer?.emailAlerts) {
        await mailer({
          to: employer?.personalDetails?.email,
          subject: `Yehaww - New Applicant`,
          html: emailAlertTemplate({ applicantName, employerName, jobId, criteria: 100 }),
        });
      }

      await mailer({
        to: applicant?.personalInfo?.contactDetail?.email,
        subject: `Yehaww - Application Acknowledgement for ${job.jobTitle} / ${job?.jobId}`,
        html: candidateAcknowledgeEmail({ mailData }),
      });

      return res.status(200).send({ msg: "Job Added to Interested Jobs" });
    } else {
      return res.status(409).send({ msg: "Added to Interested Jobs Already" });
    }
  }
};

const getCandidateMyJobs = async (req, res) => {
  const { _id, type } = req.body;
  if (type != "candidate")
    return res
      .status(409)
      .send({ msg: "Only Candidates can see the jobs he saved or jobs of his interests." });

  let myJobs = await InterestedJob.aggregate([
    {
      $match: {
        userId: _id,
        applicationRemoved: false,
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "jobDetails",
      },
    },
    { $unwind: "$jobDetails" },
    {
      $project: {
        _id: 1,
        userId: 1,
        jobId: 1,
        jobTitle: 1,
        dateApplied: 1,
        companyImage: 1,
        createdAt: "$jobDetails.createdAt",
        companyType: "$jobDetails.companyInfo.companyType",
      },
    },
  ]);

  if (myJobs.length === 0) res.status(200).send({ myJobs });

  const jobsCounts = await Job.aggregate([
    {
      $match: {
        _id: {
          $in: myJobs.map((x) => x.jobId),
        },
      },
    },
    {
      $lookup: {
        from: "interestedjobs",
        localField: "_id",
        foreignField: "jobId",
        as: "jobDetails",
      },
    },
    {
      $project: {
        appliedCandidates: { $size: "$jobDetails" },
      },
    },
  ]);

  myJobs = myJobs.map((x) => {
    return {
      ...x,
      expiresIn: moment(moment(x.createdAt).add(22, "days")).diff(moment(new Date()), "days"),
      appliedCandidates: jobsCounts.find((y) => y._id.valueOf() === x.jobId.valueOf())
        ?.appliedCandidates,
    };
  });

  res.status(200).send({ myJobs });
};

const shortListCandidates = async (req, res) => {
  const { _id, type, notes, userId, jobId, interestedStatus } = req.body;

  if (type != "employer")
    return res.status(409).send({ msg: "Only Employers Are Allowed To Shortlist Candidates" });

  const shortListCandidate = await InterestedJob.findOne({ userId, jobId });
  if (!shortListCandidate) res.status(409).send({ msg: "No such applied candidate found" });

  const jobPostedBy = await Job.findOne({ _id: jobId, userId: _id }); // finding employer who posted the job
  const candidate = await Candidate.findOne({ userId }, "personalInfo"); // finding candidate who is shortlisted
  if (!jobPostedBy)
    return res
      .status(409)
      .send({ msg: "You are not allowed to shortlist candidate for the job you have not posted." });

  if (interestedStatus === "true") {
    shortListCandidates.shortlisted = true;
    shortListCandidates.notInterested = false;
  } else if (interestedStatus === "false") {
    shortListCandidates.shortlisted = false;
    shortListCandidates.notInterested = true;
  } else if (interestedStatus === "none") {
    shortListCandidates.shortlisted = false;
    shortListCandidates.notInterested = false;
  }

  if (notes) shortListCandidates.notes = notes;

  await InterestedJob.updateOne(
    { userId, jobId },
    {
      ...shortListCandidates,
    }
  );

  const name = `${candidate?.personalInfo?.contactDetail?.firstName || ""} ${
    candidate?.personalInfo?.contactDetail?.lastName || ""
  }`;

  await mailer({
    to: candidate?.personalInfo?.contactDetail?.email,
    subject: `Shortlisted Email`,
    html: `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="utf-8" />

    <meta name="viewport" content="width=device-width" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="x-apple-disable-message-reformatting" />

    <title></title>
    <link
      href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700"
      rel="stylesheet"
    />
    <style>
      html,
      body {
        margin: 0 auto;
        padding: 0;
        width: 100%;
        background: #ebe8e2;
        font-family: "Poppins", sans-serif;
      }

      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
        text-decoration: none;
      }
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }

      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }

      img {
        -ms-interpolation-mode: bicubic;
      }

      *[x-apple-data-detectors],
      .unstyle-auto-detected-links *,
      .aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      .a6S {
        display: none !important;
        opacity: 0.01 !important;
      }

      .im {
        color: inherit !important;
      }

      img.g-img + div {
        display: none !important;
      }
      .heading1 {
        font-size: 29px;
        font-weight: 400;
        color: #424b49;
      }
      .spanClass {
        font-weight: 600;
        font-size: 29px;

        color: #424b49;
      }
      .imgLogo {
        width: 310px;
      }
      .img1 {
        height: 40px;
        width: 40px;
        margin-right: 15px;
      }
      .footerP {
        font-size: 16px;
        color: #424b49;
        font-weight: 400;
      }
      .middleBg {
        background-color: #ffffff;
        border-radius: 7px;
        padding: 40px 20px;
        margin: 0px 30px;
      }
      .imgDiv {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .innerImg {
        width: 140px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      .centerTopText {
        color: #252525;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        margin-top: 20px;
      }
      .welcomeSpan {
        color: #b19e85;
        font-size: 18px;
        font-weight: 600;
      }
      .borderDiv {
        border-bottom: 1px solid #e6e6ea;
        max-width: 300px;
        margin: 20px auto;
      }
      .textClass {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
        margin-top: 20px;
      }
      .textClassSmall {
        font-size: 16px;
      }
      .textClassNoMargin {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
      }
      .textClassTopMargin {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
        margin-top: 20px;
      }
      .disclaimer {
        color: #252525;
        font-size: 12px;
        font-weight: 400;
      }
      .applyBtn {
        border: none;
        font-size: 18px;
        color: #ffffff;
        font-weight: 400;
        padding: 20px 40px;
        border-radius: 12px;
        background-color: #b19d83;
        cursor: pointer;
      }
      .applyBtn:hover {
        background-color: #a0896b;
      }
      .aTag {
        color: #252525;
        font-weight: 600;
      }
      .li {
        margin-left: 20px;
      }
    </style>
  </head>
  <body width="100%" style="mso-line-height-rule: exactly; padding: 30px 20px">
    <div style="max-width: 800px; margin: 0 auto; width: 100%; background: #ebe8e2">
      <!-- BEGIN BODY -->
      <table
        align="center"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        width="100%"
        style="margin: auto"
      >
        <tr>
          <td valign="top">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="text-align: center">
                  <a href="https://www.yehaww.com" style="display: inline-flex"
                    ><img
                      src="${process.env.DOMAIN_API}/Images/site-logo.png"
                      class="imgLogo"
                  /></a>
                  <h1 class="heading1">
                    Hi
                    <span class="spanClass">
                      ${name},
                    </span>
                  </h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- center tr -->
        <tr>
          <td valign="middle" style="padding-top: 30px">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <div class="middleBg">
                    <div class="imgDiv">
                      <img
                        src="https://raw.githubusercontent.com/muhammadSprintx/assets/main/thumb.png?raw=true"
                        alt=""
                        class="innerImg"
                      />
                    </div>
                    <div class="borderDiv"></div>
                    <p class="textClass">
                      We are excited to announce that you have been added to the shortlist of
                      candidates for the ${jobPostedBy?.jobTitle} at ${
      jobPostedBy?.companyInfo?.companyName || "Anonymous"
    }.
                    </p>
                    <p class="textClass">
                      For more information visit My Jobs in your Yehaww profile.
                    </p>
                    <p class="textClassTopMargin">Best regards</p>
                    <p class="textClassNoMargin">The Yehaww Team</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- end tr -->
        <tr>
          <td valign="top" style="padding-top: 30px">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="text-align: center">
                  <a href="https://www.facebook.com/profile.php?id=100083581836008" target="_blank">
                    <img
                      src="${process.env.DOMAIN_API}/Images/facebook.png"
                      class="img1"
                    />
                  </a>
                  <a href="https://www.instagram.com/yehaww_com/" target="_blank">
                    <img
                      src="${process.env.DOMAIN_API}/Images/insta.svg"
                      class="img1"
                    />
                  </a>
                  <a href="https://www.linkedin.com/company/yehaww/" target="_blank">
                    <img
                      src="${process.env.DOMAIN_API}/Images/Linkdin.svg"
                      class="img1"
                      style="margin-right: 0px"
                    />
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="text-align: center; padding: 30px 0px">
                    <p class="footerP">Yehaww LLC</p>
                    <p class="footerP">
                      <a href="mailto:info@yehaww.com" target="_blank"> info@yehaww.com </a>
                      |
                      <a href="https://www.yehaww.com/" target="_blank"> yehaww.com </a>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`,
  });

  const updatedShortListCandidate = await InterestedJob.findOne({ userId, jobId });
  return res.status(200).send({
    msg: notes
      ? "Candidate Note Added"
      : updatedShortListCandidate.shortlisted
      ? "Candidate Shortlisted"
      : updatedShortListCandidate.notInterested
      ? "Candidate is not shortlisted"
      : "",
  });
};

const jobInterviews = async (req, res) => {
  const { _id, type, interviewQuestions, userId, jobId, videoInterviewRequest } = req.body;

  if (type != "employer")
    return res.status(409).send({ msg: "Only Employers Are Allowed To Add Interview Questions" });

  const jobPostedBy = await InterestedJob.findOne({ jobId, jobPostedByEmployerId: _id });
  if (!jobPostedBy)
    return res.status(409).send({
      msg: "You are not allowed to add interview questions for a job you have not posted.",
    });

  const appliedCandidate = await InterestedJob.findOne({ jobId, userId });
  if (!appliedCandidate)
    return res.status(409).send({
      msg: `No such applied job found for the following user id: ${userId}.`,
    });

  const updatedInterestedJob = await InterestedJob.updateOne(
    { userId, jobId },
    {
      videoInterviewRequest,
      interviewQuestions,
      interviewRequestDate: new Date(),
    }
  );
  if (!updatedInterestedJob?.acknowledged) {
    return res.status(409).send({
      msg: "Failed to Add Interview Questions!",
    });
  }

  return res.status(200).send({ msg: "Interview Questions Added Successfully!" });
};

const candidateJobInterviews = async (req, res) => {
  const { _id, type, jobId } = req.body;
  let { video } = req.files;
  if (type != "candidate")
    return res.status(409).send({ msg: "Only candidates are allowed to view this page" });

  const interestedJob = await InterestedJob.findOne({ jobId, userId: _id });
  if (!interestedJob)
    return res.status(409).send({
      msg: "Job not found",
    });

  if (video !== undefined && !["video/mp4"].includes(video.mimetype)) {
    throw new Error("Invalid Video Type, (mp4) Supported!");
  }

  const interviewVideoUrl = video
    ? await uploadBufS3Wrapper({
        key: `${_id + Math.floor(Math.random() * 10000000000000)}-video`,
        file: video,
      })
    : "";

  const updatedInterestedJob = await InterestedJob.updateOne(
    { userId: _id, jobId },
    { interviewVideoUrl }
  );
  if (!updatedInterestedJob.acknowledged) {
    return res.status(409).send({
      msg: "Unable to add video interview!",
    });
  }

  return res.status(200).send({ msg: "Interview Video Uploaded Successfully!" });
};

const allAppliedCandidates = async (req, res) => {
  const { _id, type } = req.body;
  const {
    jobId,
    page,
    visas,
    video,
    gender,
    skills,
    pageSize,
    verified,
    languages,
    teamCouple,
    availability,
    candidateType,
    nationalities,
    allShortListed,
    qualifications,
    quailifications,
    experienceLevelName,
  } = req.query;

  if (type != "employer")
    return res.status(409).send({ msg: "Only employer are allowed to view this page" });

  const candidatesFound = await InterestedJob.find({ jobPostedByEmployerId: _id });
  if (!candidatesFound)
    return res.status(409).send({
      msg: "No applied candidates found",
    });

  if (jobId) {
    const job = await Job.findById({ _id: jobId });
    if (!job) {
      return res.status(404).send({ msg: "Page doesn't exist" });
    }
  }

  let matchQuery = null;
  if (candidateType === "shortlisted") {
    matchQuery = {
      shortlisted: {
        $exists: true,
      },
      shortlisted: true,
    };
  } else if (candidateType === "notInterested") {
    matchQuery = {
      notInterested: {
        $exists: true,
      },
      notInterested: true,
    };
  } else {
    matchQuery = {};
  }

  const query = {
    ...(availability && { "availabilityInfo.availability": availability }),
    ...(gender && {
      "personalInfo.personalInformation.gender": gender === "All" ? { $in: genderOptions } : gender,
    }),
    ...(video && { "uploads.video": { $regex: /video/i } }),
    ...(verified && { verifications: { $gte: 1 } }),
    ...(teamCouple !== undefined && {
      "personalInfo.teamStatus.lookingForWorkAsCouple": teamCouple ? "Yes" : "No",
    }),
    ...(experienceLevelName && {
      "experience.experienceLevel.name": { $in: experienceLevelName },
    }),
    ...(visas && {
      $or: visas.map((x) => {
        return {
          "personalInfo.passportVisaInformation.visa": x,
        };
      }),
    }),
    ...(nationalities?.length && {
      $or: nationalities.map((x) => {
        return {
          "personalInfo.personalInformation.nationality": x,
        };
      }),
    }),
    ...(qualifications && {
      "diplomaCertifications.educations": { $in: qualifications },
    }),
    ...(languages && {
      "personalInfo.languages.name": { $in: languages },
    }),
    ...(skills?.length && {
      $or: skills.map((x) => {
        return {
          [`skillsDriverLicense.skills.${x}`]: "Yes",
        };
      }),
    }),
  };

  const candidates = await InterestedJob.aggregate([
    {
      $match: {
        $and: [
          { jobPostedByEmployerId: _id },
          jobId && { jobId: mongoose(jobId) },
          { applicationRemoved: false },
          matchQuery,
        ].filter((x) => x !== undefined),
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "jobDetails",
      },
    },
    { $unwind: "$jobDetails" },
    {
      $lookup: {
        from: "candidates",
        localField: "userId",
        foreignField: "userId",
        pipeline: [
          {
            $match: query,
          },
        ],
        as: "candidateDetails",
      },
    },
    { $unwind: "$candidateDetails" },
    { $skip: +pageSize * +page },
    { $limit: +pageSize },
    {
      $project: {
        userId: 1,
        notes: 1,
        coverLetter: 1,
        shortlisted: 1,
        notInterested: 1,
        interviewVideoUrl: 1,
        videoInterviewRequest: 1,
        jobId: "$jobDetails._id",
        jobTitle: "$jobDetails.jobTitle",
        cvLink: "$candidateDetails.resume",
        candidateId: "$candidateDetails._id",
        references: "$candidateDetails.references",
        profileLinkId: "$candidateDetails.profileLinkId",
        mainPhoto: "$candidateDetails.uploads.mainPhoto",
        certificates: "$candidateDetails.diplomaCertifications",
        location: "$candidateDetails.availabilityInfo.currentCountry",
        availability: "$candidateDetails.availabilityInfo.availability",
        lastName: "$candidateDetails.personalInfo.contactDetail.lastName",
        firstName: "$candidateDetails.personalInfo.contactDetail.firstName",
        phoneNumber: "$candidateDetails.personalInfo.contactDetail.phoneNumber",
      },
    },
  ]);

  const candidates2 = await InterestedJob.aggregate([
    {
      $match: {
        $and: [
          { jobPostedByEmployerId: _id },
          { ...(jobId && { jobId: mongoose(jobId) }) },
          { applicationRemoved: false },
          matchQuery,
        ],
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "jobDetails",
      },
    },
    { $unwind: "$jobDetails" },
    {
      $lookup: {
        from: "candidates",
        localField: "userId",
        foreignField: "userId",
        pipeline: [
          {
            $match: query,
          },
        ],
        as: "candidateDetails",
      },
    },
    { $unwind: "$candidateDetails" },
    { $group: { _id: null, myCount: { $sum: 1 } } },
    {
      $project: {
        userId: 1,
        coverLetter: 1,
        interviewVideoUrl: 1,
        videoInterviewRequest: 1,
        jobId: "$jobDetails._id",
        jobTitle: "$jobDetails.jobTitle",
        candidateId: "$candidateDetails._id",
        mainPhoto: "$candidateDetails.uploads.mainPhoto",
        firstName: "$candidateDetails.personalInfo.contactDetail.firstName",
        lastName: "$candidateDetails.personalInfo.contactDetail.lastName",
        availability: "$candidateDetails.availabilityInfo.availability",
        location: "$candidateDetails.availabilityInfo.currentCountry",
        _id: 0,
        myCount: 1,
      },
    },
  ]);

  let count = 0;
  count = candidates2[0]?.myCount;
  return res.status(200).send({ candidates, count });
};

const interviewVideos = async (req, res) => {
  const { _id, type } = req.body;
  const { jobId, userId } = req.query;
  let jobs = [];
  let jobsCounts = [];
  let interestedJob = {};

  if (!jobId && !userId && type != "candidate") {
    return res
      .status(409)
      .send({ msg: "Only candidates are allowed to see My Interview Videos Page" });
  }

  if (jobId && userId) {
    interestedJob = await InterestedJob.aggregate([
      {
        $match: {
          jobId: new mongoose(jobId),
          userId,
          applicationRemoved: false,
        },
      },
      {
        $lookup: {
          from: "candidates",
          localField: "userId",
          foreignField: "userId",
          as: "userData",
        },
      },
    ]);
    interestedJob = interestedJob[0];
  }

  jobs = await InterestedJob.aggregate([
    {
      $match: {
        userId: _id,
        applicationRemoved: false,
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        pipeline: [
          {
            $match: {
              createdAt: {
                $gte: new Date(moment().subtract(21, "days")),
              },
            },
          },
        ],
        as: "jobDetails",
      },
    },
    { $unwind: "$jobDetails" },
    {
      $project: {
        _id: 1,
        jobId: 1,
        userId: 1,
        jobTitle: 1,
        coverLetter: 1,
        dateApplied: 1,
        companyImage: 1,
        interviewVideoUrl: 1,
        interviewRequestDate: 1,
        createdAt: "$jobDetails.createdAt",
        companyType: "$jobDetails.companyInfo.companyType",
      },
    },
  ]);

  jobsCounts = await Job.aggregate([
    {
      $match: {
        _id: {
          $in: jobs.map((x) => x.jobId),
        },
      },
    },
    {
      $lookup: {
        from: "interestedjobs",
        localField: "_id",
        foreignField: "jobId",
        as: "jobDetails",
      },
    },
    {
      $project: {
        appliedCandidates: { $size: "$jobDetails" },
      },
    },
  ]);

  jobs = jobs.map((x) => {
    return {
      ...x,
      expiresIn: moment(moment(x.createdAt).add(22, "days")).diff(moment(new Date()), "days"),
      appliedCandidates: jobsCounts.find((y) => y._id.valueOf() === x.jobId.valueOf())
        ?.appliedCandidates,
    };
  });

  return res.status(200).send({ jobs: jobId && userId ? interestedJob : jobs });
};

const deleteApplication = async (req, res) => {
  const { _id, type } = req.body;
  const { jobId } = req.query;

  if (type != "candidate") {
    return res.status(409).send({ msg: "Only candiates are allowed to remove applications" });
  }

  const jobs = await InterestedJob.find({ userId: _id, jobId });
  if (!jobs.length) {
    return res.status(409).send({ msg: "You didn't applied for this job" });
  }

  await InterestedJob.updateOne(
    { userId: _id, jobId },
    {
      applicationRemoved: true,
    }
  );

  return res.status(200).send({ msg: "Application removed successfully" });
  x;
};

const getInterviewData = async (req, res) => {
  const { _id, type } = req.body;
  const { jobId } = req.params;
  if (type != "candidate") {
    return res
      .status(409)
      .send({ msg: "Interview data is visible to particular candidate who applied to it only." });
  }
  let interviewData = await InterestedJob.findOne(
    { userId: _id, jobId, applicationRemoved: false },
    "jobId jobTitle interviewQuestions createdAt interviewVideoUrl"
  );
  if (!interviewData) {
    return res.status(409).send({ msg: "No interview data found against this Job Id" });
  }

  interviewData = interviewData.toObject();

  interviewData.expiresIn = moment(moment(interviewData.createdAt).add(22, "days")).diff(
    moment(new Date()),
    "days"
  );

  return res.status(200).send({ interviewData });
};

const jobExpiryEmail = async () => {
  const now = new Date();
  const twentyFiveDaysAgo = new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000);
  twentyFiveDaysAgo.setUTCHours(0, 0, 0, 0);

  const nextDay = new Date(twentyFiveDaysAgo);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  const jobs25DaysAgo = await Job.find({
    updatedAt: { $gte: twentyFiveDaysAgo, $lt: nextDay },
  });
  for (const job of jobs25DaysAgo) {
    const jobId = job._id;
    const jobName = job.jobTitle;
    const jobEmployer = await Employer.findOne({ userId: job.userId });
    const employerName =
      jobEmployer?.personalDetails?.firstName + " " + jobEmployer?.personalDetails?.lastName;

    await mailer({
      to: jobEmployer?.personalDetails?.email,
      subject: `Yehaww - Job Expires`,
      html: expiryAlertTemplate({ jobName, employerName, jobId }),
    });
  }
};

const cronJob = new cron.CronJob("0 0 * * *", jobExpiryEmail);

module.exports = {
  postJob,
  editJob,
  cronJob,
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
};
