const mongoose = require("mongoose");
const cron = require("cron");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const ObjectId = require("mongodb").ObjectId;
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);
require("dotenv").config();

const User = require("../../models/users");
const Employer = require("../../models/employers");
const JobAlerts = require("../../models/jobAlerts");
const Candidate = require("../../models/candidates");
const Subscription = require("../../models/Subscription");
const {
  inactiveTemplate,
  generateReferral,
  forgotPassTemplate,
  employerSignUpTemplate,
  candidateSignUpTemplate,
  updateRefereeSubscription,
} = require("./helper");
const { generateUniqueProfileLinkId } = require("../candidate");

const { mailer } = require("../../utils/helper");

const login = async (req, res) => {
  let employer = {};
  let candidate = {};
  let { email, password } = req.body;
  email = email?.toLowerCase();

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ msg: "Email not found!" });
  }

  if (["google", "facebook"]?.includes(user?.accountType)) {
    return res.status(404).send({ msg: `Login with ${user.accountType}!` });
  }

  const token = user.generateAuthToken();

  user = user.toObject();

  if (user.type === "candidate") {
    candidate = await Candidate.findOne({ userId: user._id });
    if (!candidate) {
      return res.status(404).send({ msg: "Candidate does not exists." });
    }
    await Candidate.findOneAndUpdate(
      { userId: user?._id },
      {
        signedInAt: moment(new Date()).format("YYYY-MM-DD"),
      }
    );
  }
  if (user.type === "employer") {
    employer = await Employer.findOne({ userId: user._id }).populate("referralUsers.user");
    if (!employer) {
      return res.status(404).send({ msg: "Employer does not exists." });
    }
    user.employer = employer;
    let subscription = await Subscription.findOne({ email, canceled: false });
    if (subscription) {
      const currentSubscription = !subscription?.id?.startsWith("pi")
        ? await stripe?.subscriptions?.retrieve(subscription?.id)
        : "";

      const subscriptions = {
        600: "Start Up",
        2900: "Starter",
        4900: "Standard",
        8900: "Premium",
      };
      const subscriptionAmount = subscription?.amount || currentSubscription?.plan?.amount;
      user.subscriptionType = subscriptions[subscriptionAmount];

      subscription =
        subscription?.id?.startsWith("pi") &&
        subscription?.amount === 600 &&
        moment().isBefore(subscription?.expiry)
          ? "active"
          : currentSubscription?.status;
    }
    user.subscriptionStatus = subscription || "inActive";
  }

  const valid = await bcrypt.compare(password, user.password);

  if (password !== process.env.SUPER_ADMIN_PASS) {
    if (!valid) {
      return res.status(404).send({ msg: "Invalid Password Entered!" });
    }
  }

  user.candidateId = candidate._id;
  user.candidate = candidate;
  user.profileLinkId = candidate.profileLinkId;
  user.employer = employer;

  return res.header("authorization", token).status(200).json({ user });
};

const signUp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      type,
      entity,
      surname,
      password,
      forename,
      telCode,
      telephone,
      newsLetter,
      companyName,
      signUpReferral,
      businessAddress,
    } = req.body;
    let email = req.body.email;
    let phone = "";
    let validSignUpReferral;
    let newCandidate = {};
    let newEmployer = {};

    email = email?.toLowerCase();

    const emailFound = await User.findOne({ email }).session(session);
    if (emailFound) {
      return res.status(409).send({ msg: "Email already exists!" });
    }

    if (telephone) {
      const phoneFound = await Employer.findOne({
        "personalDetails.phoneNumber": telephone,
      }).session(session);
      if (phoneFound) {
        return res.status(409).send({ msg: "Phone number already exists!" });
      }
    }

    if (type === "employer" && signUpReferral) {
      validSignUpReferral = await Employer.findOne({ referral: signUpReferral }).session(session);

      if (!validSignUpReferral) {
        return res.status(409).json({ msg: "Invalid Referral Code!" });
      }
    }

    const newUser = new User({
      forename,
      surname,
      email,
      password,
      type,
      ...(phone && { phone }),
      ...(entity && { entity }),
      ...(companyName && { companyName }),
      ...(businessAddress && { businessAddress }),
      newsLetter,
    });

    let user = await newUser.save({ session });
    const token = user.generateAuthToken();

    if (type === "candidate") {
      const profileLinkId = await generateUniqueProfileLinkId(forename, surname);

      newCandidate = new Candidate({
        userId: user._id,
        emailAlerts: newsLetter,
        profilePublicView: true,
        profileCompletion: 0,
        verifications: 0,
        profileLinkId,
        signedInAt: moment(new Date()).format("YYYY-MM-DD"),
        profileStatuses: [false, false, false, false, false, false, false, false, false],
        personalInfo: {
          contactDetail: {
            firstName: forename,
            lastName: surname,
            email,
          },
        },
      });
      newCandidate = await newCandidate.save({ session });
      user = user.toObject();
      user.candidateId = newCandidate._id;
      user.profileLinkId = profileLinkId;

      const name = `${forename} ${surname}`;
      await mailer({
        to: email,
        subject: `Yehaww - Welcome ${name}!`,
        html: candidateSignUpTemplate({ name }),
      });

      const newJobAlerts = new JobAlerts({
        userId: user._id,
        locations: [],
        position: [],
        employmentTypes: [],
      });
      await newJobAlerts.save({ session });
    }

    if (type === "employer") {
      const referral = await generateReferral();

      if (validSignUpReferral) {
        await Employer.updateOne(
          { userId: validSignUpReferral.userId },
          { $push: { referralUsers: { user: user._id, signedUpAt: new Date(), availed: false } } },
          { session }
        );

        // await updateRefereeSubscription({ res, user: validSignUpReferral, userSigningUp: user });
      }

      newEmployer = new Employer({
        referral,
        ...(validSignUpReferral && {
          signUpReferral: { user: validSignUpReferral?.userId, availed: false },
        }),
        userId: user._id,
        emailAlerts: newsLetter,
        personalDetails: {
          firstName: forename,
          lastName: surname,
          email,
          companyName,
          businessAddress,
          phoneNumber: telCode + telephone,
        },
      });

      newEmployer = await newEmployer.save({ session });
      const employerData = await Employer.findOne({ userId: user?._id })
        .populate("referralUsers.user")
        .select("referralUsers")
        .session(session);

      user = user.toObject();
      user.employer = newEmployer;
      user.employerId = newEmployer._id;

      const name = `${forename} ${surname}`;
      await mailer({
        to: email,
        subject: `Yehaww - Welcome ${name}!`,
        html: employerSignUpTemplate({ name }),
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .header("authorization", token)
      .status(201)
      .json({ user, msg: "Signed-up Successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({ msg: "Sign-up failed! Please try again later." });
  }
};

const socialSignUp = async ({ data }) => {
  let { email, picture, newsLetter, surname, forename, type, accountType } = data;

  let newCandidate = {};
  let newEmployer = {};

  email = email?.toLowerCase();

  const emailFound = await User.findOne({ email });
  if (emailFound) {
    return res.status(409).send({ msg: "Email already exists!" });
  }

  const newUser = new User({
    type,
    email,
    newsLetter,
    ...(surname && { surname }),
    ...(forename && { forename }),
    ...(accountType && { accountType }),
  });

  let user = await newUser.save();
  const token = user.generateAuthToken();

  if (type === "candidate") {
    const profileLinkId = await generateUniqueProfileLinkId(forename, surname);

    newCandidate = new Candidate({
      userId: user._id,
      emailAlerts: newsLetter,
      profilePublicView: true,
      profileCompletion: 0,
      verifications: 0,
      profileLinkId,
      signedInAt: moment(new Date()).format("YYYY-MM-DD"),
      profileStatuses: [false, false, false, false, false, false, false, false, false],
      personalInfo: { contactDetail: { firstName: forename, lastName: surname, email } },
      uploads: { mainPhoto: picture },
    });
    newCandidate = await newCandidate.save();
    user = user.toObject();
    user.candidateId = newCandidate._id;
    user.profileLinkId = profileLinkId;

    const name = `${forename} ${surname}`;
    await mailer({
      to: email,
      subject: `Yehaww - Welcome ${name}!`,
      html: candidateSignUpTemplate({ name }),
    });

    const newJobAlerts = new JobAlerts({
      userId: user._id,
      locations: [],
      position: [],
      employmentTypes: [],
    });
    await newJobAlerts.save();
  }

  // Send Sign Up email
  if (type === "employer") {
    newEmployer = new Employer({
      userId: user._id,
      emailAlerts: newsLetter,
      personalDetails: { firstName: forename, lastName: surname, email, profilePicture: picture },
    });
    newEmployer = await newEmployer.save();
    user = user.toObject();
    user.employerId = newEmployer._id;
    const name = `${forename} ${surname}`;
    await mailer({
      to: email,
      subject: `Yehaww - Welcome ${name}!`,
      html: employerSignUpTemplate(name),
    });
  }

  return { token, user };
};

const forgotPassword = async (req, res) => {
  let { email } = req.body;

  email = email?.toLowerCase();

  if (!email) {
    return res.status(422).send({ msg: "Email is missing" });
  }

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send({ msg: "Invalid email!" });
  }

  const randomNum = Math.round(Math.random() * 1000000);
  const userName = user.forename.charAt(0).toUpperCase() + user.forename.slice(1);

  const token = (() => {
    const max = 60 * 60;
    const token = jwt.sign(
      {
        email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: max,
      }
    );
    return token;
  })();

  // Send Reset Password email
  await mailer({
    to: email,
    subject: "Yehaww - Reset Password",
    html: forgotPassTemplate({ name: `${user?.forename} ${user?.surname}`, token, email }),
  });

  res.status(200).send({ msg: "Please Check your email." });
};

const changePassword = async (req, res) => {
  let { email, newPassword } = req.body;

  email = email?.toLowerCase();

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ msg: "Invalid email!" });
  }

  let updateStatus = await User.updateOne({ email }, { $set: { password: newPassword } }); //pre function updates pass to encrypted pass
  if (!updateStatus) {
    return res.status(500).send("Update Failed");
  }

  res.status(200).send({ msg: "Password Updated Successfully." });
};

const resetPassword = async (req, res) => {
  let { token, password } = req.body;

  const decoded = await jwt.verify(token, process.env.JWT_KEY);

  if (!decoded?.email) {
    return res.status(400).send({ msg: "Invalid Rest Password Link Provided" });
  }

  const email = decoded?.email?.toLowerCase();

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ msg: "Invalid email!" });
  }

  let updateStatus = await User.updateOne({ email }, { $set: { password } }); //pre function updates pass to encrypted pass
  if (!updateStatus) {
    return res.status(500).send("Update Failed");
  }

  res.status(200).send({ msg: "Password Updated Successfully." });
};

const deleteProfile = async (req, res) => {
  const { _id, type, password } = req.body;
  let user = await User.findById(_id);
  if (!user) {
    return res.status(404).send({ msg: "Invalid User!" });
  }

  if (!ObjectId.isValid(_id)) {
    return res.status(404).send({ msg: "Invalid User Id!" });
  }

  if (password) {
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(404).send({ msg: "Invalid Password Entered!" });
    }
  }

  if (type === "employer") {
    await Employer.deleteOne({ userId: _id });
  }
  if (type == "candidate") {
    await Candidate.deleteOne({ userId: _id });
  }

  await User.deleteOne({ _id });

  const userDelCheck = await User.findOne({ _id });
  if (userDelCheck) {
    return res.status(404).send({ msg: "User wasn't deleted successfully" });
  }

  res.status(200).send({ msg: "Profile Deleted Successfully" });
};

const getById = async (req, res) => {
  let user = null;
  let candidate = null;
  let employer = null;
  let { _id, email } = req.body;

  email = email?.toLowerCase();

  if (!_id || _id <= 0) {
    return res.status(401).send({ msg: "Id not present!" });
  }

  user = await User.findById(_id);
  if (!user) {
    return res.status(404).send({ msg: "User does not exists!" });
  }

  user = user.toObject();

  if (user.type === "candidate") {
    candidate = await Candidate.findOne({ userId: user._id }, "uploads profileLinkId");
    if (!candidate) {
      return res.status(404).send({ msg: "Candidate does not exists." });
    }
    user.candidateId = candidate._id;
    user.candidate = candidate;
    user.profileLinkId = candidate.profileLinkId;
  }
  if (user.type === "employer") {
    employer = await Employer.findOne({ userId: user._id }).populate("referralUsers.user");
    if (!employer) {
      return res.status(404).send({ msg: "Employer does not exists." });
    }
    user.employer = employer;
    let subscription = await Subscription.findOne({ email, canceled: false });
    if (subscription) {
      const currentSubscription = !subscription?.id?.startsWith("pi")
        ? await stripe?.subscriptions?.retrieve(subscription?.id)
        : "";
      const subscriptions = {
        600: "Start Up",
        2900: "Starter",
        4900: "Standard",
        8900: "Premium",
      };
      const subscriptionAmount = subscription?.amount || currentSubscription?.plan?.amount;
      user.subscriptionType = subscriptions[subscriptionAmount];
      user.subscriptionExpiry = subscription?.expiry;

      subscription =
        subscription?.id?.startsWith("pi") &&
        subscription?.amount === 600 &&
        moment().isBefore(subscription?.expiry)
          ? "active"
          : currentSubscription?.status;
    }
    user.subscriptionStatus = subscription || "inActive";
  }
  res.status(200).json(user);
};

const getPayment = async (req, res) => {
  const { number, exp_month, exp_year, cvc } = req.body;

  if (req.body.type !== "employer") {
    res.status(409).send("User is not an Employer");
  } else {
    var token = await stripe.tokens.create({
      card: { number, exp_month, exp_year, cvc },
    });
    if (!token) {
      res.status(409).send("Card details not entered correctly");
    }
    var customer = await stripe.customers.create({
      email: req.body.email.toLowerCase(),
      name: `${req.body.forename} ${req.body.surname}`,
      source: token.id,
    });
  }

  const charge = await stripe.charges.create({
    amount: 600,
    currency: "usd",
    source: token.card.id,
    customer: customer.id,
    description: "One time registration fee",
  });
  if (!charge) {
    res.status(409).send("Payment not successful");
  } else {
    res.status(200).send("Payment successful");
  }
};

const socialLogin = async (req, res) => {
  try {
    const { type, code, newsLetter, accountType, fbUserID } = req.body;

    const access_token = code;
    let userData;
    if (!access_token) {
      return res.status(400).send({
        msg: "We are having trouble logging you in",
      });
    }

    if (accountType === "google") {
      const { data } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      userData = data;
    } else if (accountType === "facebook") {
      const { data } = await axios.get(
        `https://graph.facebook.com/${fbUserID}?fields=id,name,email,picture&access_token=${access_token}`
      );
      userData = { ...data, picture: data.picture.data.url };
    }

    let { email, name, picture } = userData;
    if (!email) {
      return res.status(400).send({
        msg: "We are having trouble logging you in",
        msgDetails: userData,
        email: "Not Found",
      });
    }

    email = email.toLowerCase();
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      if (type) {
        const surname = name?.split(" ")[1];
        const forename = name?.split(" ")[0];
        const data = { surname, forename, email, picture, newsLetter, type, accountType };

        const { token, user } = await socialSignUp({ data });
        return res
          .header("authorization", token)
          .status(200)
          .json({ user, msg: "Signed-up Successfully" });
      } else {
        return res.status(404).send({ msg: "Email not found!" });
      }
    }

    let userDataObject = await User.findOne({ email });
    if (userDataObject) {
      const token = userDataObject.generateAuthToken();
      userDataObject = userDataObject.toObject();

      if (userDataObject.type === "candidate") {
        const candidateData = await handleCandidateData(userDataObject);
        userDataObject = { ...userDataObject, ...candidateData };
      }

      if (userDataObject.type === "employer") {
        const employerData = await handleEmployerData(userDataObject, email);
        userDataObject = { ...userDataObject, ...employerData };
      }

      return res
        .header("authorization", token)
        .status(200)
        .send({ msg: "Logged-In Successfully", user: userDataObject });
    } else {
      res.status(409).send({ msg: "We are having trouble logging you in" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      msg: "We are having trouble logging you in",
      msgDetails: err?.response?.data || null,
    });
  }
};
const handleCandidateData = async (userData) => {
  const candidate = await Candidate.findOne({ userId: userData._id });
  if (!candidate) {
    throw new Error("Candidate does not exist.");
  }

  await Candidate.findOneAndUpdate(
    { userId: userData._id },
    { signedInAt: moment(new Date()).format("YYYY-MM-DD") }
  );

  return {
    candidateId: candidate._id,
    candidate,
    profileLinkId: candidate.profileLinkId,
  };
};

const handleEmployerData = async (userData, email) => {
  const employer = await Employer.findOne({ userId: userData._id }).populate("referralUsers.user");
  if (!employer) {
    throw new Error("Employer does not exist.");
  }

  let subscription = await Subscription.findOne({ email, canceled: false });
  let subscriptionStatus = "inActive";
  let subscriptionType = null;

  if (subscription) {
    const currentSubscription = !subscription.id.startsWith("pi")
      ? await stripe.subscriptions.retrieve(subscription.id)
      : null;

    const subscriptions = {
      600: "Start Up",
      2900: "Starter",
      4900: "Standard",
      8900: "Premium",
    };

    const subscriptionAmount = subscription.amount || currentSubscription?.plan?.amount;
    subscriptionType = subscriptions[subscriptionAmount];

    subscriptionStatus =
      subscription.id.startsWith("pi") &&
      subscription.amount === 600 &&
      moment().isBefore(subscription.expiry)
        ? "active"
        : currentSubscription?.status;
  }

  return {
    employer,
    subscriptionType,
    subscriptionStatus,
  };
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const assignReferralsToEmployers = async (req, res) => {
  try {
    const employersWithoutReferral = await Employer.find({
      referral: { $exists: false },
    });
    if (employersWithoutReferral.length === 0) {
      return res.status(200).json({
        message: "No employers found without referral codes.",
      });
    }

    for (const employer of employersWithoutReferral) {
      const referralCode = await generateReferral();
      employer.referral = referralCode;
      await employer.save();
      await delay(10);
    }

    res.status(200).json({
      message: `Referral codes assigned to ${employersWithoutReferral.length} employer(s) successfully.`,
    });
  } catch (error) {
    console.error("Error during referral assignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const createSubscriptionHistory = async ({ subscription, email, interval }) => {
  const newSubscription = await Subscription.findOneAndUpdate(
    { id: subscription?.id },
    {
      $set: {
        email: email,
        expiry: moment().add(subscription?.lines?.data?.[0]?.plan?.interval_count, interval),
        subscription_data: {
          invoice_id: subscription.latest_invoice,
          currency: subscription?.currency,
          discount_percent: subscription?.discount?.coupon?.percent_off ?? 0,
          paid: subscription?.paid,
          status: subscription?.status,
          period_start: subscription?.period_start,
          period_end: subscription?.period_end,
          subtotal: (subscription?.subtotal ?? 0) / 100,
          subtotal_excluding_tax: (subscription?.subtotal_excluding_tax ?? 0) / 100,
          total_excluding_tax: (subscription?.total_excluding_tax ?? 0) / 100,
          total: (subscription?.total ?? 0) / 100,
          created: subscription?.created,
        },
      },
    },
    { new: true, upsert: true }
  );
  await newSubscription.save();
};
const addStripeSubscriptionDetailsToEmployers = async (req, res) => {
  try {
    const subscriptionsWithoutData = await Subscription.find({
      subscription_data: { $exists: false },
    });
    const subscription = await stripe.subscriptions.retrieve(id);

    for (const subscriptionRecord of subscriptionsWithoutData) {
      const { id } = subscriptionRecord;
      try {
        const subscription = await stripe.subscriptions.retrieve(id);
        if (subscription) {
          const customer = await stripe.customers.retrieve(subscription?.customer);
          const email = customer.email;
          const interval = subscription?.lines?.data?.[0]?.plan?.interval === "year" ? "Y" : "M";
          // commented out for safety reasons, uncomment below when required
          // await createSubscriptionHistory({
          //   subscription,
          //   email,
          //   interval,
          // });
        }
      } catch (error) {
        console.error(`Error fetching subscription ${id} from Stripe: `, error);
      }
    }
    res.status(200).json({ message: "Subscriptions updated successfully" });
  } catch (error) {
    console.error("Error updating subscriptions: ", error);
    res.status(500).json({ message: "Failed to update subscriptions", error });
  }
};

const inActiveEmail = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

  const nextDay = new Date(thirtyDaysAgo);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  const inActiveCandidates = await Candidate.find({
    signedInAt: { $gte: thirtyDaysAgo, $lt: nextDay },
  });
  for (const candidate of inActiveCandidates) {
    const { email, firstName, lastName } = candidate?.personalInfo?.contactDetail;
    const name = firstName + " " + lastName;
    await mailer({
      to: email,
      subject: `Yehaww - Inactive User`,
      html: inactiveTemplate({ name }),
    });
  }
};

const cronEmailExpiry = new cron.CronJob("0 0 * * *", inActiveEmail);

module.exports = {
  login,
  signUp,
  getById,
  getPayment,
  socialLogin,
  resetPassword,
  deleteProfile,
  changePassword,
  forgotPassword,
  cronEmailExpiry,
  assignReferralsToEmployers,
  addStripeSubscriptionDetailsToEmployers,
};
