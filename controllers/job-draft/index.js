const moment = require("moment");
const { object } = require("joi");
const User = require("../../models/users");
const JobDraft = require("../../models/jobDrafts");
const InterestedJob = require("../../models/interestedJobs");
const { stayCleanPositions } = require("../../utils/arrayHelper");
const { uploadFile, deleteImage, validateCity, handleSingleJobMapping } = require("../job/helper");

const postDraft = async (req, res) => {
  const userId = req.body._id;
  const { job } = req.body;
  const {
    job: {
      positionInfo: { image, homeBase, currentlyLocated },
    },
  } = req.body;

  // validate home base city
  if (homeBase?.city) validateCity(homeBase?.country, homeBase?.city);

  // validate Currently Located city
  if (currentlyLocated?.city) validateCity(currentlyLocated?.country, currentlyLocated?.city);

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

  const highestJob = await JobDraft.findOne(
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

  const updatedJob = new JobDraft({
    userId,
    ...job,
  });
  await updatedJob.save();

  return res.status(200).send({ msg: "Draft Posted Successfully" });
};

const editDraft = async (req, res) => {
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

  const jobFound = await JobDraft.findOne({ _id: jobId, userId });
  if (!jobFound) return res.status(409).send({ msg: "Draft not found or Invalid Draft Id" });

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
  const updatedJob = await JobDraft.updateOne(
    { _id: jobId, userId },
    {
      ...job,
    }
  );
  if (!updatedJob.acknowledged) return res.status(409).send({ msg: "Draft Update Failed" });

  return res.status(200).send({ msg: "Draft Updated Successfully" });
};

const deleteDraft = async (req, res) => {
  const { _id, type } = req.body;
  const jobObjectId = req.params.id;

  if (type != "employer")
    return res.status(409).send({ msg: "Only employers are allowed to delete posts." });

  const job = await JobDraft.findOne({ _id: jobObjectId, userId: _id });
  if (!job) return res.status(409).send({ msg: "Job not found or Invalid Job Id" });

  const deleteJobPosition = await JobDraft.deleteOne({ _id: jobObjectId });
  if (!deleteJobPosition.deletedCount) {
    return res.status(500).send("Delete Draft Failed");
  }
  deleteImage({ jobId: job.jobId, userId: _id });
  res.status(200).send({ msg: "Draft Deleted Successfully" });
};

const getDraftById = async (req, res) => {
  let interestedJobIds = [];
  const jobId = req.params.id;
  const { _id, type } = req.body;

  const job = await JobDraft.findById(jobId);
  if (!job) {
    return res.status(409).send({ msg: "Draft not found" });
  }

  if (type === "candidate") {
    interestedJobIds = await InterestedJob.find(
      { userId: _id, applicationRemoved: false },
      "-_id jobId"
    );
    interestedJobIds = interestedJobIds.map((x) => x?.jobId?.toString());
  }
  const candidateCount = await JobDraft.aggregate([
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

const jobDraftByEmployer = async (req, res) => {
  const { _id, type } = req.body;
  const { properties, pageSize, page } = req.query;

  if (type !== "employer")
    return res.status(409).send({ msg: "Only employers are allowed to view active posts." });

  let jobs = await JobDraft.find({ userId: _id }, properties)
    .sort({ updatedAt: -1 })
    .skip(pageSize * page)
    .limit(pageSize);
  const jobsCount = await JobDraft.find({ userId: _id }).count();
  if (jobsCount === 0) return res.status(409).send({ msg: "No Drafts Found." });

  const perJobsCount = await JobDraft.aggregate([
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
    const { _id, jobId, jobTitle, createdAt, companyInfo, positionInfo, jobFilledStatus } = jobs;

    return {
      _id,
      jobTitle,
      jobFilledStatus,
      image: positionInfo?.image,
      companyType: companyInfo?.companyType,
      list: [`Draft ID # ${jobId}`, `${moment(new Date(createdAt)).format("Do MMMM YYYY")}`],
      appliedCandidates: perJobsCount.find((y) => y?._id.valueOf() === _id?.valueOf())
        ?.appliedCandidates,
    };
  });

  return res.status(200).send({ jobs, jobsCount });
};

module.exports = {
  postDraft,
  editDraft,
  deleteDraft,
  getDraftById,
  jobDraftByEmployer,
};
