const ObjectId = require("mongoose").Types.ObjectId;
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

const JobAlerts = require("../../models/jobAlerts");
const Candidates = require("../../models/candidates");
const References = require("../../models/references");
const Subscription = require("../../models/Subscription");
const InterestedJob = require("../../models/interestedJobs");

const { mailer } = require("../../utils/helper");
const { genderOptions } = require("../../utils/arrayHelper");
const { experienceDurationsMinMax, resultCardFormat, handleDataMapping } = require("./helper");

const getProfile = async (req, res) => {
  try {
    const { id, jobId } = req.params;
    let { mapped, properties, email: candidateEmail } = req.query;
    let { type, email, _id } = req.body;
    let subscribed = false;
    let propObject = {};

    email = email?.toLowerCase();
    candidateEmail = candidateEmail?.toLowerCase();

    if (properties) {
      properties.split(" ").forEach((x) => {
        propObject[x.replace("-", "")] = x.includes("-") ? 0 : 1;
      });
    }

    mapped = mapped !== undefined ? JSON.parse(mapped) : false;

    const isObjectId = ObjectId.isValid(id) && String(new ObjectId(id)) === id;
    const matchCriteria = isObjectId ? { _id: new ObjectId(id) } : { profileLinkId: id };

    let newCandidate = await Candidates.aggregate(
      [
        {
          $match: matchCriteria,
        },
        {
          $lookup: {
            from: "interestedjobs",
            localField: "userId",
            foreignField: "userId",
            pipeline: [
              {
                $match: {
                  ...(jobId && { jobId: new ObjectId(jobId) }),
                },
              },
            ],
            as: "jobDetails",
          },
        },
        { $unwind: { path: "$jobDetails", preserveNullAndEmptyArrays: true } },
        {
          ...(properties && {
            $project: { ...propObject, userId: 1 },
          }),
        },
      ].filter((x) => Object.keys(x).length)
    );

    newCandidate = newCandidate[0];

    if (newCandidate === undefined || newCandidate === null) {
      return res.status(409).send({ msg: "Invalid Candidate Id!" });
    }

    if (type === "employer") {
      let subscription = await Subscription.findOne({ email, canceled: false });
      if (subscription) {
        const sub = await stripe?.subscriptions?.retrieve(subscription?.id);
        subscription = sub?.status;
      }
      subscribed = subscription === "active";
    }

    if (jobId) {
      let interestedJob = await InterestedJob.findOne(
        { userId: newCandidate.userId, jobId },
        "-_id coverLetter jobTitle companyName"
      );
      if (interestedJob === null) {
        return res.status(409).send({ msg: "No Interested Job Found!" });
      }

      newCandidate.interestedJob = interestedJob;
    }
    if (!mapped) {
      let jobAlerts = await JobAlerts.findOne(
        { userId: newCandidate?.userId },
        "-_id employmentTypes locations positions"
      );
      if (jobAlerts === null) {
        return res.status(409).send({ msg: "No Job alert found" });
      }
      if (newCandidate?.personalInfo && newCandidate?.personalInfo?.desiredPosition) {
        newCandidate.personalInfo.desiredPosition.jobAlerts = jobAlerts;
      }
      delete newCandidate.userId;
    }

    subscribed =
      _id === newCandidate?.userId
        ? true
        : newCandidate?.personalInfo?.contactDetail?.email?.toLowerCase() === candidateEmail
        ? true
        : subscribed;
    return res.status(200).json({
      ...(mapped ? await handleDataMapping(newCandidate, subscribed) : newCandidate),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "There is some issue with server!", error });
  }
};

const findCandidate = async (req, res) => {
  let {
    page,
    visas,
    video,
    email,
    gender,
    skills,
    position,
    category,
    pageSize,
    lastName,
    verified,
    firstName,
    languages,
    teamCouple,
    properties,
    resultCard,
    availability,
    nationalities,
    qualifications,
    currentlyBased,
    experienceLevelName,
    professionalExperience,
    profileCompletion,
  } = req.query;

  const query = {
    ...(profileCompletion && { profileCompletion }),
    // profilePublicView: true,
    ...(position && category
      ? {
          $and: [
            {
              $or: [
                { "personalInfo.desiredPosition.firstChoice": new RegExp(position, "i") },
                { "personalInfo.desiredPosition.secondChoice": new RegExp(position, "i") },
              ],
            },
            {
              $or: [
                { "personalInfo.desiredPosition.firstChoice": new RegExp(category, "i") },
                { "personalInfo.desiredPosition.secondChoice": new RegExp(category, "i") },
              ],
            },
          ],
        }
      : position
      ? {
          $or: [
            { "personalInfo.desiredPosition.firstChoice": new RegExp(position, "i") },
            { "personalInfo.desiredPosition.secondChoice": new RegExp(position, "i") },
          ],
        }
      : category
      ? {
          $or: [
            { "personalInfo.desiredPosition.firstChoice": new RegExp(category, "i") },
            { "personalInfo.desiredPosition.secondChoice": new RegExp(category, "i") },
          ],
        }
      : ""),
    ...(availability && { "availabilityInfo.availability": availability }),
    ...(professionalExperience && {
      $and: [
        {
          "experience.totalExperienceDurationMonths": {
            $gte: experienceDurationsMinMax[professionalExperience].min,
          },
        },
        {
          "experience.totalExperienceDurationMonths": {
            $lte: experienceDurationsMinMax[professionalExperience].max,
          },
        },
      ],
    }),
    ...(currentlyBased && { "availabilityInfo.currentCountry": currentlyBased }),
    ...(video && { "uploads.video": { $regex: /video/i } }),
    ...(verified && { verifications: { $gte: 1 } }),
    ...(teamCouple !== undefined && {
      "personalInfo.teamStatus.lookingForWorkAsCouple":
        teamCouple === "true" ? { $in: ["Yes", "Ideally"] } : "No",
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
      "diplomaCertifications.education": { $in: qualifications },
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
    ...(firstName && {
      "personalInfo.contactDetail.firstName": { $regex: new RegExp(firstName, "i") },
    }),
    ...(lastName && {
      "personalInfo.contactDetail.lastName": { $regex: new RegExp(lastName, "i") },
    }),
    ...(email && {
      "personalInfo.contactDetail.email": { $regex: new RegExp(email, "i") },
    }),
    ...(gender &&
      gender !== "All" && {
        "personalInfo.personalInformation.gender": gender,
      }),
    // ...(gender && {
    //   "personalInfo.personalInformation.gender": gender === "All" ? { $in: genderOptions } : gender,
    // }),
  };

  let candidates = await Candidates.find(query, properties)
    .skip(pageSize * page)
    .limit(pageSize)
    .sort({ profileCompletion: -1, signedInAt: -1 });
  const candidatesCount = await Candidates.find(query).count();
  if (resultCard) {
    candidates = candidates.map(resultCardFormat);
  }

  return res.status(200).json({
    candidates,
    count: candidatesCount,
  });
};

const metaData = async (req, res) => {
  const { _id } = req.body;

  const validateCandidate = await Candidates.findOne({ userId: _id });
  if (!validateCandidate) {
    return res.status(409).send({ msg: "User does not exists" });
  }

  const candidate = (
    await Candidates.findOne(
      { userId: _id },
      "profilePublicView  emailAlerts profileCompletion profileStatuses profileLinkId"
    )
  ).toObject();

  return res.status(200).json({
    ...candidate,
  });
};

const getAllVideos = async (req, res) => {
  let subscribed = false;
  let { type, email } = req.body;
  email = email?.toLowerCase();

  const { position, sort, page, pageSize } = req.query;
  const properties =
    "uploads.video uploads.mainPhoto personalInfo.contactDetail.firstName personalInfo.contactDetail.lastName availabilityInfo";

  const query = {
    profileCompletion: { $gte: 90 },
    ...(position &&
      position !== "All" && {
        $or: [
          { "personalInfo.desiredPosition.firstChoice": position },
          { "personalInfo.desiredPosition.secondChoice": position },
        ],
      }),
    "uploads.video": { $exists: true },
  };

  let videos = await Candidates.find(query)
    .sort({ createdAt: sort === "Newest" ? -1 : 1 })
    .skip(pageSize * page)
    .limit(pageSize);
  const videosCount = await Candidates.find(query).count();

  if (type === "employer") {
    let subscription = await Subscription.findOne({ email, canceled: false });
    if (subscription) {
      subscription =
        // subscription?.id?.includes("pi") &&
        // subscription?.amount === 600 &&
        // moment().isBefore(subscription?.expiry)
        //   ? "active"
        //   :
        (await stripe?.subscriptions?.retrieve(subscription?.id))?.status;
    }
    subscribed = subscription === "active";
  }

  videos = videos.map(
    ({
      _id,
      personalInfo: {
        contactDetail: { firstName, lastName },
      },
      profileLinkId,
      availabilityInfo: { availability, currentCountry, currentLocation },
      uploads: { mainPhoto, video },
    }) => {
      return {
        id: _id,
        firstName,
        lastName,
        availability,
        profileLinkId,
        currentCountry,
        currentLocation,
        image: mainPhoto,
        ...(subscribed && { video }),
      };
    }
  );

  return res.status(200).json({
    videos,
    count: videosCount,
  });
};

const settings = async (req, res) => {
  const { _id, emailAlerts, profilePublicView } = req.body;

  const validateCandidate = await Candidates.findOne({ userId: _id });
  if (!validateCandidate) {
    return res.status(409).send({ msg: "User does not exists" });
  }

  await Candidates.updateOne(
    { userId: _id },
    {
      emailAlerts,
      profilePublicView,
    }
  );

  const candidate = await Candidates.findOne(
    { userId: _id },
    "emailAlerts profilePublicView profileLinkId"
  );

  return res.status(200).json({
    candidate,
  });
};

const verifyReferences = async (req, res) => {
  const { verified, ratings } = req.body;
  let { userId, email } = req.query;
  email = email?.toLowerCase();

  const referenceExists = await References.findOne({ userId, email });
  if (referenceExists) {
    return res.status(409).send({ msg: "Candidates Reference Verification is already done!" });
  }

  const candidate = await Candidates.findOne({ userId, "references.email": email });
  if (!candidate) {
    return res.status(409).send({ msg: "No Such Candidate exists" });
  }

  const currentReference = candidate.references.find((x) => x.email === email);
  if (currentReference.verified || currentReference.denied) {
    return res.status(409).send({ msg: "Candidates Reference Verification is already done!" });
  }

  if (verified) {
    candidate.verifications++;
    candidate.references = candidate.references.map((x) => {
      if (x.email === email) {
        x.verified = true;
      }
      return x;
    });

    const updatedCandidate = await Candidates.findOneAndUpdate(
      { userId, "references.email": email },
      {
        ...candidate,
      },
      {
        new: true,
      }
    );

    const verifiedReference = new References({
      userId,
      email,
      ratings: { ...ratings },
    });
    await verifiedReference.save();

    return res.status(200).send({ updatedCandidate });
  } else {
    candidate.references = candidate.references.map((x) => {
      if (x.email === email) {
        x.denied = true;
      }
      return x;
    });

    await Candidates.updateOne(
      { userId, "references.email": email },
      {
        references: candidate.references,
      }
    );

    return res.status(200).send({ msg: "Reference Verification Declined Successfully" });
  }
};

const getReferenceDetails = async (req, res) => {
  let { email, userId, verified } = req.query;
  email = email?.toLowerCase();

  const currentCandidate = await Candidates.findOne({ userId });
  if (!currentCandidate) {
    return res.status(409).send({ msg: "User does not exists" });
  }

  const referenceExists = await References.findOne({ userId, email });
  if (referenceExists && !verified) {
    return res.status(409).send({ msg: "Candidates Reference Verification is already done!" });
  }

  const { firstName, lastName } = currentCandidate?.personalInfo?.contactDetail;
  const candidateName = `${firstName} ${lastName}`;
  const userReference = await Candidates.findOne(
    { userId },
    { references: { $elemMatch: { email } } }
  );
  if (!userReference.references.length) {
    return res.status(409).send({ msg: "User reference does not exists" });
  }

  const [reference] = userReference.references;
  const { name: refName, companyName, url } = reference;

  res.status(200).send({
    url,
    refName,
    verified: referenceExists,
    companyName,
    candidateName,
  });
};

const requestPartnerVerification = async (req, res) => {
  const { partnerEmail } = req.query;

  let cEmail = req.body.email;
  cEmail = cEmail.toLowerCase();

  if (cEmail === partnerEmail) {
    return res.status(409).send({ msg: "Partner email can't be same as Candidate's own email!" });
  }

  const candidate = await Candidates.findOne({ "personalInfo.contactDetail.email": cEmail });
  if (candidate === null) {
    return res.status(409).send({ msg: "Invalid Candidate Email!" });
  }
  const partner = await Candidates.findOne({ "personalInfo.contactDetail.email": partnerEmail });
  if (partner === null) {
    return res.status(409).send({ msg: "Invalid Partner Email!" });
  }

  // candidate already has a partner
  // if (candidate.personalInfo.teamStatus.partnerEmail) {
  //   return res.status(409).send({ msg: "You already have a partner!" });
  // }

  // partner already has a partner
  if (partner.personalInfo.teamStatus.partnerEmail) {
    return res.status(409).send({ msg: "Partner already have a partner!" });
  }

  // add partner email in candidate profile as requestedPartnerVerification
  await Candidates.updateOne(
    {
      "personalInfo.contactDetail.email": cEmail,
    },
    {
      "personalInfo.teamStatus.lookingForWorkAsCouple": "Yes",
      "personalInfo.teamStatus.partnerEmail": "",
      "personalInfo.teamStatus.requestedPartnerVerification": partnerEmail,
    }
  );

  const candidateContactDetail = candidate.personalInfo.contactDetail;
  const senderName = `${candidateContactDetail.firstName} ${candidateContactDetail.lastName}`;
  const partnerContactDetail = partner.personalInfo.contactDetail;
  const receiverName = `${partnerContactDetail.firstName} ${partnerContactDetail.lastName}`;

  await mailer({
    to: partnerEmail,
    subject: `${senderName} - Requested Partner Verification`,
    html: `
       <!DOCTYPE html>
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
        background-color: #fff;
        border-radius: 7px;
        padding: 40px 20px;
        margin: auto;
        width: 100%;
        max-width: 100%;
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
      .aTag {
        color: #252525;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      @media (max-width: 425px) {
        .middleBg{
        max-width: 270px;}
      }
    </style>
  </head>
  <body width="100%" style="mso-line-height-rule: exactly; padding: 30px 20px">
    <div style="max-width: 800px; margin: 0 auto; width: 100% ;background: #ebe8e2">
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
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
            >
              <tr>
                <td style="text-align: center">
                  <a
                    href="https://www.yehaww.com"
                    style="display: inline-flex"
                    ><img
                      src="${process.env.DOMAIN_API}/Images/site-logo.png"
                      class="imgLogo"
                  /></a>
                  <h1 class="heading1">
                    Dear
                    <span class="spanClass"> ${receiverName}, </span>
                  </h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- center tr -->
        <tr>
          <td valign="middle" style="padding-top: 30px">
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
            >
              <tr>
                <td>
                  <div class="middleBg">
                    <div class="imgDiv">
                      <img
                        src="https://github.com/muhammadSprintx/assets/blob/main/thumb.png?raw=true"
                        alt=""
                        class="innerImg"
                      />
                    </div>
                    <div class="borderDiv"></div>
                    <p class="textClass">
                      This email is sent to you as a request for the
                      confirmation to add your email as partner with
                      ${senderName} on
                      <a
                        href="https://www.yehaww.com/"
                        class="aTag"
                        target="_blank"
                        >Yehaww.com</a
                      >
                    </p>

                    <p class="textClass">
                      Please confirm my partner verification by clicking the
                      following link below.
                      <a
                        href="${process.env.DOMAIN_API}/api/candidate/partnerConfirmation?candidateEmail=${cEmail}&partnerEmail=${partnerEmail}"
                        class="aTag"
                        >${process.env.DOMAIN_API}/api/candidate/partnerConfirmation?candidateEmail=${cEmail}&partnerEmail=${partnerEmail}</a
                      >
                    </p>
                    <p class="textClass">Thank you in advance</p>
                    <p class="textClass">Kindest regards</p>

                    <p class="textClass">(Please do not reply to this email)</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- end tr -->
        <tr>
          <td valign="top" style="padding-top: 30px">
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
            >
              <tr>
                <td style="text-align: center">
                  <a
                    href="https://www.facebook.com/profile.php?id=100083581836008"
                    target="_blank"
                  >
                    <img
                      src="${process.env.DOMAIN_API}/Images/facebook.png"
                      class="img1"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/yehaww_com/"
                    target="_blank"
                  >
                    <img
                      src="${process.env.DOMAIN_API}/Images/insta.svg"
                      class="img1"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/yehaww/"
                    target="_blank"
                  >
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
                    <a href="mailto:info@yehaww.com" target="_blank">
                      info@yehaww.com
                      </a>
                      |
                     <a href="https://www.yehaww.com/" target="_blank">
                        yehaww.com
                      </a>
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

  return res.status(200).send({
    msg: "Partner Verification Request Email Sent!",
    teamStatus: {
      ...candidate?.personalInfo?.teamStatus,
      lookingForWorkAsCouple: "Yes",
      requestedPartnerVerification: partnerEmail,
    },
  });
};

const partnerConfirmation = async (req, res) => {
  let { candidateEmail, partnerEmail } = req.query;
  candidateEmail = candidateEmail.toLowerCase();
  partnerEmail = partnerEmail.toLowerCase();

  if (candidateEmail === partnerEmail) {
    res.status(409).send({ msg: "Partner email can't be same as Candidate's own email!" });
  }

  const candidate = await Candidates.findOne({
    "personalInfo.contactDetail.email": candidateEmail,
    "personalInfo.teamStatus.requestedPartnerVerification": partnerEmail,
  });
  if (candidate === null) {
    res.status(409).send({ msg: "Invalid Candidate Email!" });
  }

  const partner = await Candidates.findOne({
    "personalInfo.contactDetail.email": partnerEmail,
  });
  if (partner === null) {
    res.status(409).send({ msg: "Invalid Partner Email!" });
  }

  // add partner in candidate profile
  await Candidates.updateOne(
    {
      "personalInfo.contactDetail.email": candidateEmail,
      "personalInfo.teamStatus.requestedPartnerVerification": partnerEmail,
    },
    {
      "personalInfo.teamStatus.lookingForWorkAsCouple": "Yes",
      "personalInfo.teamStatus.partnerEmail": partnerEmail,
      $unset: { "personalInfo.teamStatus.requestedPartnerVerification": 1 },
    }
  );

  // add candidate as partner in partner profile
  await Candidates.updateOne(
    {
      "personalInfo.contactDetail.email": partnerEmail,
    },
    {
      "personalInfo.teamStatus.lookingForWorkAsCouple": "Yes",
      "personalInfo.teamStatus.partnerEmail": candidateEmail,
    }
  );

  res.writeHead(302, {
    Location: `${process.env.DOMAIN}/user-profile?id=${partner._id}`,
  });
  res.end();
};

const clearPartnerEmail = async (req, res) => {
  let { email } = req.body;
  email = email?.toLowerCase();

  let partners = await Candidates.find(
    {
      $or: [
        { "personalInfo.contactDetail.email": email },
        { "personalInfo.teamStatus.partnerEmail": email },
        { "personalInfo.teamStatus.requestedPartnerVerification": email },
      ],
    },
    "_id"
  );

  partners = partners.map(({ _id }) => _id);
  if (!partners.length) {
    return res.status(409).send("You are no one's Partner!");
  }

  const updated = await Candidates.updateMany(
    {
      _id: { $in: partners },
    },
    {
      "personalInfo.teamStatus.lookingForWorkAsCouple": "No",
      "personalInfo.teamStatus.partnerEmail": "",
      "personalInfo.teamStatus.requestedPartnerVerification": "",
    }
  );
  if (!updated.acknowledged) {
    return res.status(409).send("Partner Removal Unsuccessful");
  }

  return res.status(200).send({ msg: "Partner removed successfully" });
};

const updateProfileLink = async (req, res) => {
  const { _id, profileLinkId } = req.body;

  if (!profileLinkId) {
    return res.status(409).send({ msg: "Profile Custom Url is required!" });
  }

  const regex = /^(?!-)[a-z0-9]+(-[a-z0-9]+)*(?<!-)$/;

  if (!regex.test(profileLinkId)) {
    return res.status(409).send({ msg: "Please enter a valid url" });
  }

  const validateCandidate = await Candidates.findOne({ userId: _id });
  if (!validateCandidate) {
    return res.status(409).send({ msg: "User does not exists" });
  }

  const linkExists = await Candidates.find({ profileLinkId });
  if (linkExists?.length) {
    if (!(linkExists?.length === 1 && linkExists[0]?.userId === _id)) {
      return res.status(409).send({ msg: "Url is not Unique!" });
    }
  }

  await Candidates.updateOne({ userId: _id }, { profileLinkId });

  const candidate = await Candidates.findOne(
    { userId: _id },
    "emailAlerts profilePublicView profileLinkId"
  );
  return res.status(200).json({ candidate });
};

const generateUniqueProfileLinkId = async (firstName, lastName) => {
  const sanitizeName = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const generateTimestampString = () => {
    return Date.now().toString(36).slice(-6);
  };

  let baseLinkId = `${sanitizeName(firstName)}-${sanitizeName(
    lastName
  )}-${generateTimestampString()}`;
  let profileLinkId = baseLinkId;

  while (await Candidates.findOne({ profileLinkId })) {
    baseLinkId = `${sanitizeName(firstName)}-${sanitizeName(
      lastName
    )}-${generateTimestampString()}`;
    profileLinkId = baseLinkId;
  }

  return profileLinkId;
};

const bulkAddProfileLink = async (req, res) => {
  try {
    const candidates = await Candidates.find();

    for (const candidate of candidates) {
      const { firstName, lastName } = candidate.personalInfo.contactDetail;
      if (!firstName || !lastName) continue;

      const profileLinkId = await generateUniqueProfileLinkId(firstName, lastName);

      candidate.profileLinkId = profileLinkId;
      await candidate.save();
    }

    return res.status(200).send({ msg: "Profile Link IDs updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      msg: "Error occurred while updating profile link IDs",
      msgDetails: err.message,
    });
  }
};

module.exports = {
  metaData,
  settings,
  settings,
  getProfile,
  getAllVideos,
  findCandidate,
  verifyReferences,
  updateProfileLink,
  clearPartnerEmail,
  bulkAddProfileLink,
  getReferenceDetails,
  partnerConfirmation,
  requestPartnerVerification,
  generateUniqueProfileLinkId,
};
