require("dotenv").config();
const Employer = require("../../models/employers");
const Subscription = require("../../models/Subscription");
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

const generateReferral = async () => {
  return new Date().getTime();
  // let referralCode;
  // let isUnique = false;
  // let digits = 4;

  // while (!isUnique) {
  //   referralCode = Math.floor(Math.random() * Math.pow(10, digits))
  //     .toString()
  //     .padStart(digits, "0");

  //   const existingCode = await Employer.findOne({ referral: referralCode });

  //   if (!existingCode) {
  //     isUnique = true;
  //   } else {
  //     // If all possible combinations for the current digit length are exhausted, increase the digit length
  //     if (parseInt(referralCode) === Math.pow(10, digits) - 1) {
  //       digits++;
  //     }
  //   }
  // }

  // return referralCode;
};

const updateRefereeSubscription = async ({ user }) => {
  const employer = await Employer.findOne({ _id: user?._id });

  const email = employer?.personalDetails?.email;

  const subscription = await Subscription.findOne({ email, canceled: false });
  if (subscription) {
    const stripeSubscription = await stripe?.subscriptions?.retrieve(subscription?.id);
    if (stripeSubscription) {
      const interval = stripeSubscription?.items?.data[0]?.price?.recurring?.interval;
      const interval_count = stripeSubscription?.items?.data[0]?.price?.recurring?.interval_count;

      const unusedReferrals = employer?.referralUsers?.filter((u) => !u?.availed);
      const monthsToAdd =
        unusedReferrals?.length *
        (interval === "month" ? interval_count : interval === "year" ? 12 : 0);

      const updatedDiscMonths =
        stripeSubscription?.discount?.coupon?.duration_in_months + monthsToAdd;

      const newCoupon = await stripe.coupons.create({
        percent_off: stripeSubscription?.discount?.coupon?.percent_off,
        duration: "repeating",
        duration_in_months: updatedDiscMonths,
      });

      await stripe.subscriptions.update(subscription.id, {
        discounts: newCoupon?.id ? [{ coupon: newCoupon?.id }] : [],
      });

      await Employer.updateMany(
        { email, "referralUsers.availed": false },
        { $set: { "referralUsers.$[elem].availed": false } },
        { arrayFilters: [{ "elem.availed": false }] }
      );
    }
  }
};

const forgotPassTemplate = ({ name, token, email }) => {
  return `<!DOCTYPE html>
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
      .aTag {
        color: #252525;
        font-weight: 600;
      }
      .aTagBlue {
          color: #024cba;
          font-weight: 600;
        }
        .aTagBlue:hover {
            text-decoration: underline;
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
                    <span class="spanClass">${name}</span>
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
                    <p class="textClass">Hi ${name}</p>
                    <p class="textClass">We have received a request to reset your password.</p>
                    <a href="${process.env.DOMAIN}/login?reset=true&email=${email}&token=${token}" class="textClass aTagBlue">Click Here To Reset Your Password.</p>
                    <p class="textClass">
                      <a href="${process.env.DOMAIN}/login" class="aTag" target="_blank">Log in</a>
                      here
                    </p>
                    <p class="textClass">
                      Please note: You can change your password within 'My Profile' at any time.
                    </p>
                    <p class="textClass">
                      If any questions do not hesitate to contact us at:
                      <a href="https://www.yehaww.com/contact-us" class="aTag">info@yehaww.com</a>
                    </p>
                    <p class="textClass">Best Regards</p>
                    <p class="textClass">
                      Yehaww Team
                      <a href="https://www.yehaww.com/" class="aTag" target="_blank"
                        >www.yehaww.com</a
                      >
                    </p>
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
`;
};

const inactiveTemplate = ({ name }) => {
  return `<!DOCTYPE html>
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
        font-family: "Poppins", sans-serif;
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
        flex-direction: column;
        gap: 40px;
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
        margin-top: 30px;
      }
      .aTag {
        color: #252525;
        font-weight: 600;
      }
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40px;
      }
      .aTag1 {
        background: #b09d83;
        border-radius: 6px;
        padding: 5px 15px;
        font-size: 26px;
        font-weight: 600;
        color: #fff;
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
                    <span class="spanClass">${name}, </span>
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
                        src="${process.env.DOMAIN}/assets/alert.png"
                        alt=""
                        class="innerImg"
                      />
                      <p class="textClass">
                        <a href="${process.env.DOMAIN}/" class="aTag" target="_blank">Yehaww</a>
                        - it's been 30 days since your last sign in!
                      </p>
                    </div>
                    <div class="borderDiv"></div>
                    <p class="textClass">
                      Just a friendly heads-up that it's been a month since you last signed into
                      your. To keep your profile up and running, make sure you log in at least once
                      every 30 days.
                    </p>
                    <p class="textClass">
                      Remember, if you don't
                      <a href="${process.env.DOMAIN}/login" class="aTag" target="_blank">sign in</a>
                      within 30 days, your profile will temporarily go inactive, and after that
                      period, your availability status will switch to 'Unknown.' Any applications
                      you've submitted for jobs will also become inactive.
                    </p>
                    <p class="textClass">
                      If you're still interested in pursuing exciting opportunities, don't forget to
                      reset your availability on
                      <a href="${process.env.DOMAIN}/" class="aTag" target="_blank">Yehaww</a>. Your
                      adventure awaits!
                    </p>
                    <div class="btn">
                      <a href="${process.env.DOMAIN}/jobs" class="aTag1" target="_blank"
                        >See Our Latest Jobs And Positions</a
                      >
                    </div>
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
`;
};

const employerSignUpTemplate = ({ name }) => {
  return `<!DOCTYPE html>
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
                margin:0px 30px;

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
                    <span class="spanClass"> ${name}, </span>
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
                        src="${process.env.DOMAIN_API}/Images/tv.png"
                        alt=""
                        class="innerImg"
                      />
                    </div>
                    <div class="borderDiv"></div>
                    <p class="textClass">
                      As an employer, Yehaww can help you find and connect you
                      and your company with all the talented staff that the
                      equestrian world has to offer, all over the world.
                    </p>
                    <p class="textClass">
                      This has always been the great idea behind Yehaww, no
                      matter where in the world you, your farm or your company
                      is located. Or what position you are hoping to fill.
                      Looking for an exercise rider, dressage groom, property
                      manager or personal assistant? We will help you find what
                      you need. Post a job with the specific criteria you are
                      searching for in your new employee, such as experience,
                      qualifications and skills. Let the website shortlist a
                      group of candidates that are interested in your position
                      and that matches those criteria.
                    </p>
                    <p class="textClass">
                      You as an employer will then have access to the profiles
                      and contact details of all the shortlisted candidates.
                    </p>
                    <p class="textClass">
                      All you have to do then is to connect!
                    </p>
                    <p class="textClass">
                      You can also simply search in the Yehaww database to find
                      any talents that have the visibility of their profile
                      turned on. This means that the person isn’t interested in
                      a specific position at the moment but has chosen to
                      increase the exposure of their profile and want to be
                      available for contact directly by an employer. This is the
                      way to head hunt a person that might be the perfect choice
                      for you!
                    </p>
                    <p class="textClass">
                      Yehaww is there for all of us in the Equestrian world to
                      build a strong community and we are so excited to have you
                      with us.
                    </p>

                    <p class="textClass">
                      Follow us on our
                      <a
                        href="https://www.instagram.com/yehaww_com/"
                        class="aTag"
                        target="_blank"
                        >Instagram</a
                      >
                      account for the latest news.
                    </p>

                    <p class="textClass">
                      If any questions do not hesitate to contact us at:
                      <a href="https://www.yehaww.com/contact-us" class="aTag"
                        >info@yehaww.com</a
                      >
                    </p>
                    <p class="textClass">
                      We hope Yehaww will give you everything you wish for and
                      we are looking forward to hearing from you.
                    </p>
                    <p class="textClass">Best Regards</p>
                    <p class="textClass">
                      Yehaww Team
                      <a
                        href="https://www.yehaww.com/"
                        class="aTag"
                        target="_blank"
                        >www.yehaww.com</a
                      >
                    </p>
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
`;
};

const candidateSignUpTemplate = ({ name }) => {
  return `<!DOCTYPE html>
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
                margin:0px 30px;
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
                    <span class="spanClass">${name}, </span>
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
                        src="${process.env.DOMAIN_API}/Images/tv.png"
                        alt=""
                        class="innerImg"
                      />
                    </div>
                    <div class="borderDiv"></div>
                    <p class="textClass">
                      As you are a talented person we want to connect you with
                      employers all over the world, giving you the opportunity
                      of a life time.
                    </p>
                    <p class="textClass">
                      This has always been the great idea behind Yehaww, no
                      matter where in the world you are, what position you are
                      looking for, exercise rider, dressage groom, property
                      manager, personal assistant, we will help you find that.
                    </p>
                    <p class="textClass">
                      After completing your profile online you can show interest
                      in any position you would like to apply for and just wait
                      for the employers to contact you.
                    </p>
                    <p class="textClass">
                      By doing so the employer(s) that posted the position(s)
                      you are interested in, will have access to your profile
                      and contact details.
                    </p>
                    <p class="textClass">
                      If you are the person they are looking for by meeting the
                      criteria for the job, such as experience, qualifications
                      and skills, you will automatically be shortlisted and
                      presented to the employer(s) by the website.
                    </p>
                    <p class="textClass">
                      On Yehaww we also have the feature to “Turn on” the
                      visibility of your profile at all times in your profile
                      settings, even if you are not showing interest in a
                      specific position at the moment. This will increase the
                      exposure of your profile and make it available when
                      searching in the database and will give you the
                      opportunity to be found directly by an employer.
                    </p>
                    <p class="textClass">
                      Yehaww is there for all of us in the Equestrian world to
                      build a strong community and we are so excited to have you
                      with us.
                    </p>
                    <p class="textClass">
                      Follow us on our
                      <a
                        href="https://www.instagram.com/yehaww_com/"
                        class="aTag"
                        target="_blank"
                        >Instagram</a
                      >
                      account for the latest news.
                    </p>
                    <p class="textClass">
                      If any questions do not hesitate to contact us at:
                      <a href="https://www.yehaww.com/contact-us" class="aTag"
                        >info@yehaww.com</a
                      >
                    </p>
                    <p class="textClass">
                      We hope Yehaww will give you everything you wish for and
                      we are looking forward to hearing from you.
                    </p>
                    <p class="textClass">Best Regards</p>
                    <p class="textClass">
                      Yehaww Team
                      <a
                        href="https://www.yehaww.com/"
                        class="aTag"
                        target="_blank"
                        >www.yehaww.com</a
                      >
                    </p>
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
`;
};

module.exports = {
  generateReferral,
  inactiveTemplate,
  forgotPassTemplate,
  employerSignUpTemplate,
  candidateSignUpTemplate,
  updateRefereeSubscription,
};
