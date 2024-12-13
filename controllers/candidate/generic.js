const User = require("../../models/users");
const Employer = require("../../models/employers");
const Candidate = require("../../models/candidates");

const { handlers, profileIndex, completeHandler, successMsg } = require("./helper");
const { removeKeys } = require("../../utils/helper");

const candidateGenericController = async (req, res) => {
  let newTypeStatus = true;
  const type = req.body.route;
  const userId = req.body._id;
  let body = { [type]: req.body[type] };

  const email =
    req?.body?.personalInfo?.contactDetail?.email && req?.body?.personalInfo?.contactDetail?.email;
  const partnerEmail =
    req?.body?.personalInfo?.teamStatus?.partnerEmail &&
    req?.body?.personalInfo?.teamStatus?.partnerEmail;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(409).send({ msg: "User does not exists" });
  }
  const candidateEmail = await Candidate.findOne({ "personalInfo.contactDetail.email": email });
  const employerEmail = await Employer.findOne({ "personalDetails.email": email });
  if (user.email !== email && candidateEmail) {
    return res.status(409).send({ msg: "Email Already in use" });
  }
  if (user.email !== email && employerEmail) {
    return res.status(409).send({ msg: "Email Already in use!" });
  }

  const prevCandidate = (await Candidate.findOne({ userId }))?.toObject() || false;
  if (!prevCandidate) {
    return res.status(409).send({ msg: "Candidate does not exists" });
  }

  removeKeys(prevCandidate, ["_id", "__v"]);

  // handling edge cases for each type
  body = handlers[type]
    ? await handlers[type]?.({ type, body, userId, prevCandidate, files: req.files, req })
    : body;

  // check is current type complete
  newTypeStatus = completeHandler[type]
    ? completeHandler[type]?.({ type, body, prevCandidate })
    : newTypeStatus;

  const prevTypeStatus = prevCandidate.profileStatuses[profileIndex[type]];

  // update profile status
  prevCandidate.profileStatuses[profileIndex[type]] = newTypeStatus;

  // update profile completion
  const newAddition =
    !newTypeStatus && +prevTypeStatus
      ? type === "skillsDriverLicense"
        ? -20
        : -10
      : newTypeStatus == +prevTypeStatus
      ? 0
      : type === "skillsDriverLicense"
      ? 20
      : 10;

  const newCandidate = await Candidate.findOneAndUpdate(
    { userId },
    {
      ...prevCandidate,
      profileCompletion: +prevCandidate.profileCompletion + newAddition,
      [type]: body[type] !== "object" ? body[type] : { ...body[type] },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return res.status(200).json({ msg: successMsg[type], newCandidate });
};

module.exports = {
  candidateGenericController,
};
