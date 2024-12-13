const Candidates = require("../../models/candidates");
const Jobs = require("../../models/jobs");

const { handleJobMapping } = require("./helper");

const queryToFindJobs = async (query) => {
  return await Jobs.find(query).sort({ createdAt: -1 }).limit(6);
};

const dashboardData = async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const countCandidates = await Candidates.countDocuments();
  const countJobs = await Jobs.countDocuments({
    $or: [
      { jobFilledStatus: true },
      {
        $and: [{ jobFilledStatus: false }, { updatedAt: { $gte: thirtyDaysAgo } }],
      },
    ],
  });

  const fiveRecentJobs = handleJobMapping(await queryToFindJobs());
  const fiveHandsOnJobs = handleJobMapping(await queryToFindJobs({ jobType: "Hands On" }));
  const fiveStayCleanJobs = handleJobMapping(await queryToFindJobs({ jobType: "Stay Clean" }));

  res.status(200).send({
    candidateCount: `${countCandidates}`,
    jobCount: `${countJobs}`,
    fiveRecentJobs,
    fiveHandsOnJobs,
    fiveStayCleanJobs,
  });
};

module.exports = { dashboardData };
