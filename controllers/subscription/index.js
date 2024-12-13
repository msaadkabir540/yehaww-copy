const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

const { mailer } = require("../../utils/helper");
const { cancelRequestEmail } = require("./helper");
const Subscription = require("../../models/Subscription");
const Employer = require("../../models/employers");
const { emailAlertTemplate, paymentFailedEmailTemplate } = require("../job/helper");

const checkOutSession = async (req, res) => {
  const { email, type, lookup_key } = req.body;
  if (type !== "employer") {
    return res.status(409).send({ msg: "Only Employer Can Make Subscriptions!" });
  }

  if (!lookup_key) {
    return res.status(409).send({ msg: "Choose a Plan to continue!" });
  }

  const price = await stripe.prices.retrieve(lookup_key);

  const interval = price?.recurring?.interval;
  const interval_count = price?.recurring?.interval_count;

  const employer = await Employer.findOne({ "personalDetails.email": email });

  const unusedReferrals = employer?.referralUsers?.filter((user) => !user.availed)?.length;
  const firstUnusedReferralIndex = employer?.referralUsers?.findIndex((user) => !user.availed);
  const isSignUpReferral =
    employer?.signUpReferral?.user && !employer?.signUpReferral?.availed ? true : false;

  let discount = null;
  if (isSignUpReferral || unusedReferrals > 0) {
    const coupon = await stripe.coupons.create({
      percent_off: 20,
      duration: "once",
    });
    discount = coupon.id;
  }
  const referralUser = firstUnusedReferralIndex
    ? employer?.referralUsers?.[firstUnusedReferralIndex]?.user
    : "";
  //
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    customer_email: email,
    line_items: [{ price: lookup_key, quantity: 1 }],
    mode: "subscription",
    ...(discount
      ? { discounts: [{ coupon: discount }] }
      : {
          allow_promotion_codes: true,
        }),
    success_url: `${process.env.DOMAIN}/subscription?success=true`,
    cancel_url: `${process.env.DOMAIN}/?canceled=true`,
    subscription_data: {
      metadata: {
        isCheckout: true,
        email,
        isSignUpReferral,
        ...(referralUser && { referralUser }),
        firstUnusedReferralIndex,
      },
    },
  });

  res.status(200).json({ redirect: session.url });
};

const setDefault = async (req, res) => {
  try {
    const result = await Subscription.updateMany({}, { canceled: false, cancelRequested: false });

    res.status(200).json({ message: "All subscriptions updated", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const webhook = async (req, res) => {
  let event = req.body;
  let subscription;
  let status;
  // Handle the event
  switch (event.type) {
    case "invoice.payment_succeeded": {
      subscription = event.data.object;
      const subscription_details = event.data?.object?.subscription_details?.metadata;

      const customer = await stripe.customers.retrieve(subscription?.customer);
      const email = customer.email;
      const interval = subscription?.lines?.data?.[0]?.plan?.interval === "year" ? "Y" : "M";

      if (subscription.billing_reason === "subscription_create") {
        const emailExists = await Subscription.findOne({
          canceled: false,
          email,
          id: { $ne: subscription.subscription },
        });
        if (emailExists) {
          const prevSubscription = await stripe?.subscriptions?.retrieve(emailExists?.id);
          if (prevSubscription) {
            const prevCouponId = prevSubscription?.discount?.coupon?.id;

            await stripe.subscriptions.update(subscription?.subscription, {
              discounts: prevCouponId ? [{ coupon: prevCouponId }] : [],
            });
          }

          await stripe.subscriptions.del(emailExists?.id);

          const updateData = { canceled: true };
          if (emailExists.requestData) {
            updateData.requestData = { ...emailExists.requestData, status: "Canceled" };
          }

          await Subscription.updateOne({ id: emailExists.id }, updateData);
        }
        await createSubscriptionHistoryAndValidateReferral({
          subscription,
          email,
          interval,
          isCheckout: true,
        });
      } else if (subscription.billing_reason === "subscription_cycle") {
        await createSubscriptionHistoryAndValidateReferral({
          subscription,
          email,
          interval,
          isCycle: true,
        });
      }
      break;
    }
    case "invoice.payment_failed": {
      subscription = event.data.object;
      const email = subscription.customer_email;
      const name = subscription.customer_name;
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}/${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}/${currentDate.getFullYear()}`;

      try {
        await mailer({
          to: email,
          subject: `Payment Failed - Action Required`,
          html: paymentFailedEmailTemplate({
            employerName: name,
            date: formattedDate,
          }),
        });

        console.log(`Payment failure email sent to: ${name}`);
      } catch (error) {
        console.error(`Failed to send payment failure email: ${error}`);
      }
      break;
    }
    case "invoice.upcoming": {
      subscription = event.data.object;
      const customer = await stripe.customers.retrieve(subscription?.customer);
      const email = customer.email;
      const employer = await Employer.findOne({ "personalDetails.email": email });
      const unusedReferrals = employer?.referralUsers?.filter((user) => !user.availed)?.length;
      const firstUnusedReferralIndex = employer?.referralUsers?.findIndex((user) => !user.availed);
      const isSignUpReferral =
        employer?.signUpReferral?.user && !employer?.signUpReferral?.availed ? true : false;

      let discount = null;
      if (isSignUpReferral || unusedReferrals > 0) {
        const unusedReferral = employer?.referralUsers?.find((user) => !user.availed);

        const coupon = await stripe.coupons.create({
          percent_off: 20,
          duration: "once",
        });
        discount = coupon.id;
        await stripe.subscriptions.update(subscription.subscription, {
          discounts: [{ coupon: discount }],
        });

        if (isSignUpReferral == true) {
          employer.signUpReferral.availed = true;
          await employer.save();
        } else if (unusedReferral) {
          unusedReferral.availed = true;
          await employer.save();
        }

        console.log("Discount applied successfully for upcoming invoice");
      }
      break;
    }
    // case "payment_intent.succeeded": {
    //   subscription = event.data.object;
    //   const amount = subscription.amount_received;
    //   const customerId = subscription.customer;
    //   const customer = await stripe.customers.retrieve(customerId);

    //   const newSubscription = new Subscription({
    //     id: subscription?.id,
    //     email: customer.email,
    //     expiry: moment().add(6, "M"),
    //     amount,
    //   });
    //   await newSubscription.save();

    //   break;
    // }
    case "customer.subscription.deleted": {
      subscription = event.data.object;
      const customerId = subscription.customer;
      const customer = await stripe.customers.retrieve(customerId);
      subscription = await Subscription.findOne({ email: customer.email });
      await Subscription.updateOne(
        { email: customer.email },
        {
          canceled: true,
          requestData: { ...subscription?.requestData, status: "Canceled" },
        }
      );
      break;
    }
    default:
      // Unexpected event type
      console.info(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 res to acknowledge receipt of the event
  res.send();
};

const createSubscriptionHistoryAndValidateReferral = async ({
  subscription,
  email,
  interval,
  isCheckout = null,
  isCycle = null,
}) => {
  const newSubscription = new Subscription({
    id: subscription?.subscription,
    email: email,
    expiry: moment().add(subscription?.lines?.data?.[0]?.plan?.interval_count, interval),
    subscription_data: {
      invoice_id: subscription.id,
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
  });
  await newSubscription.save();

  if (isCheckout && email) {
    const employer = await Employer.findOne({
      "personalDetails.email": email,
    });
    const isSignUpReferral =
      employer?.signUpReferral?.user && !employer?.signUpReferral?.availed ? true : false;
    const unusedReferral = employer?.referralUsers?.find((user) => !user.availed);

    if (isSignUpReferral) {
      employer.signUpReferral.availed = true;
      await employer.save();
    } else if (unusedReferral) {
      unusedReferral.availed = true;

      await employer.save();
    }
  }
};

const getSubscriptionHistory = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const subscriptions = await Subscription.find({ email });

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({ msg: "No subscriptions found for this email" });
    }

    const subscriptionData = [];
    let count = 0;

    for (const subscription of subscriptions) {
      try {
        const invoices = await stripe.invoices.list({ subscription: subscription?.id });
        const invoiceData = invoices?.data;
        for (const invoice of invoices?.data || []) {
          const discount = invoice?.discount?.coupon;
          const subtotal = invoice?.subtotal_excluding_tax / 100 || 0;
          const total = invoice?.total_excluding_tax / 100 || 0;
          const discountAmount = subtotal - total;
          const percentOff = discount?.percent_off || 0;

          const transactionDate = moment.unix(invoice.created).toDate();
          const transactionId = `${++count}${moment(transactionDate).format("DMYY")}`;
          const amount = total;

          const plan =
            amount === 29
              ? "Starter"
              : amount === 49
              ? "Standard"
              : amount === 89
              ? "Premium"
              : "Unknown Plan";

          const startDate = invoice.period_start
            ? moment.unix(invoice.period_start).format("DD, MMM YYYY")
            : "";
          const endDate = invoice.period_end
            ? moment.unix(invoice.period_end).format("DD, MMM YYYY")
            : "";

          subscriptionData.push({
            plan,
            transactionId,
            transactionDate: transactionDate ? moment(transactionDate).format("DD, MMM YYYY") : "",
            duration: `${startDate} - ${endDate}`,
            percentage: `${percentOff} %`,
            discount: `${discountAmount.toFixed(2)} $`,
            amount: `${subtotal.toFixed(2)} $`,
            discountAmounts: `${total.toFixed(2)} $`,
          });
        }
      } catch (err) {
        console.error(`Error processing subscription ID ${subscription?.id}:`, err.message);
      }
    }

    return res.status(200).json({ subscriptions: subscriptionData });
  } catch (err) {
    console.error("Error fetching subscription history:", err.message);
    return res.status(500).json({ msg: "An internal server error occurred." });
  }
};

const getSubscriptionInvoice = async (req, res) => {
  try {
    let invoice;
    let stripeSubscription;
    const { email } = req.query;
    const subscription = await Subscription.findOne({ email, canceled: false });
    if (subscription) {
      stripeSubscription = await stripe.subscriptions.retrieve(subscription?.id);
      if (stripeSubscription.latest_invoice) {
        invoice = await stripe.invoices.retrieve(stripeSubscription.latest_invoice);
        return res.status(200).json({ invoice: invoice?.invoice_pdf });
      }
    } else {
      return res.status(200).json({ invoice: "" });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const { name, email, reason, feedback, alternative } = req.body;

    const plan = await Subscription.findOne({ email, canceled: false });
    const subscription = !plan?.id?.includes("pi")
      ? await stripe?.subscriptions?.retrieve(plan?.id)
      : "";

    const subscriptionAmount = plan?.amount || subscription?.plan?.amount;

    const subscriptions = {
      600: "Start Up",
      2900: "Starter",
      4900: "Standard",
      8900: "Premium",
    };

    const planName = subscriptions[subscriptionAmount];

    const requestData = {
      cancelRequested: true,
      requestData: {
        reason,
        feedback,
        alternative,
        date: new Date(),
        status: "Pending",
      },
    };

    await Subscription.findOneAndUpdate({ _id: plan?._id }, requestData);

    await mailer({
      to: "info@yehaww.com",
      subject: `Subscription Cancellation Request!`,
      html: cancelRequestEmail({ name, email, reason, feedback, alternative, planName }),
    });

    return res.status(200).json({ msg: "Request Sent Successfully!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  webhook,
  setDefault,
  cancelRequest,
  checkOutSession,
  getSubscriptionHistory,
  getSubscriptionInvoice,
};
