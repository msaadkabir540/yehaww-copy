const moment = require("moment/moment");

const { s3Bucket } = require("../../utils/s3");
const { checkValidFileTypes, uploadPDFToS3 } = require("../../utils/helper");
const countryCityList = require("../../utils/json/countries+states+cities.json");

const uploadFile = async ({ image, jobId, userId }) => {
  const checkedFile = checkValidFileTypes({
    base64: image,
    validFileTypes: ["png", "jpg", "jpeg", "webp"],
  });
  if (image && !checkedFile.valid) {
    throw new Error("Invalid Image Types!");
  }

  const buf = (type) => Buffer.from(image.replace(`data:${type};base64,`, ""), "base64");

  const url = await uploadPDFToS3({
    key: `${userId}-${jobId}-company`,
    buf: buf(checkedFile.type),
    ContentType: checkedFile.type,
  });

  return url;
};

const deleteImage = async ({ jobId, userId }) => {
  s3Bucket.deleteObject({ Key: `${userId}-${jobId}-company` }, (err) => {
    if (err) throw new Error(err);
  });
};

const validateCity = (country, city) => {
  const citiesList = [];
  countryCityList
    ?.find((x) => x.name === country)
    ?.states?.forEach((x) => citiesList?.push(...x.cities.map((x) => x.name)));
  if (!citiesList?.includes(city)) {
    throw new Error("Invalid City Name Entered");
  }
};

const salaryOptions = [
  "",
  { min: 0, max: 1500 },
  { min: 1501, max: 3000 },
  { min: 3001, max: 5000 },
  { min: 5001, max: 10000 },
  { min: 10001, max: 15000 },
  { min: 15001 },
];

const handleSingleJobMapping = (newJob, interestedJobIds) => {
  const data = {
    ...newJob,
    interested: interestedJobIds.includes(newJob?._id.toString()),
    overview: [
      { key: "Company Size", value: newJob.companyInfo?.companySize || "" },
      { key: "Company Type", value: newJob.companyInfo?.companyType || "" },
      { key: "Employment Type", value: newJob?.employmentType || "" },
      { key: "Current Location", value: newJob.positionInfo?.currentlyLocated?.country || "" },
      {
        key: "Competition Location",
        value: `${newJob.positionInfo?.competition?.country}`,
      },
      {
        key: "Professional Equine Experience",
        value: newJob?.preferredCandidate?.professionalExperience || "",
      },
      {
        key: "Team Couple",
        value: newJob?.preferredCandidate?.team || "",
      },
      {
        key: "Bring Your Own Dog",
        value: newJob?.preferredCandidate?.bringOwnDog || "",
      },
      {
        key: "Bring Your Own Horse",
        value: newJob?.preferredCandidate?.bringOwnHorse || "",
      },
      {
        key: "Live In",
        value: newJob?.positionInfo?.liveIn || "",
      },
      {
        key: "Posted",
        value: moment(newJob?.createdAt).format("Do MMM YYYY") || "",
      },
    ],
  };

  return data;
};

const activePostsFrontEndFormat = (jobs) => {
  const { _id, jobFilledStatus, jobId, jobTitle, positionInfo, createdAt, companyInfo } = jobs;

  return {
    _id,
    jobTitle,
    jobFilledStatus,
    image: positionInfo?.image,
    companyType: companyInfo?.companyType,
    list: [
      `Job ID # ${jobId}`,
      `${moment(new Date(createdAt)).format("Do MMMM YYYY")}`,
      `21 days remaining`,
    ],
  };
};

const emailAlertTemplate = ({ employerName, applicantName, jobId, criteria }) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    <meta name="viewport" content="width=device-width" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="x-apple-disable-message-reformatting" />
    <title>Document</title>
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
      .lineDiv {
        border-bottom: 1px solid #e6e6ea;
        max-width: 600px;
        margin: 20px auto;
      }
      .textClass {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
        margin-top: 20px;
      }
      .marginClass {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
      }
      .aTag {
        color: #252525;
        font-weight: 600;
      }
      .view {
        margin-top: 20px;
      }
      .italicText {
        font-style: italic;
}

    </style>
  </head>
  <body width="100%" style="mso-line-height-rule: exactly; padding: 30px 20px">
    <div
      style="max-width: 800px; margin: 0 auto; width: 100%; background: #ebe8e2"
    >
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
                  <a href="https://www.yehaww.com" style="display: inline-flex"
                    ><img
                      src="${process.env.DOMAIN_API}/Images/site-logo.png"
                      class="imgLogo"
                  /></a>
                  <h1 class="heading1">
                    Dear
                    <span class="spanClass">${employerName}, </span>
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
                    <p class="textClass">Hi!</p>
                    <p class="marginClass">
                      ${applicantName} has applied for the job you posted on
                       <a
                        href="https://www.yehaww.com/"
                        class="aTag"
                        target="_blank"
                        >Yehaww.com</a
                      >
                      and they match your criteria ${criteria}%.
                    </p>
                    <p class="textClass">
                    Remember to login for
                      <a
                        href="${process.env.DOMAIN}/candidate/active-post?jobId=${jobId}"
                        class="aTag"
                        target="_blank"
                        >View application</a
                      >
                    </p>
                    <p class="textClass">Best Regards</p>
                    <p class="marginClass">
                      Yehaww Team
                    </p>
                    <div class="lineDiv"></div>
                    <p class="textClass">Disclaimer</p>
                    <p class="textClass italicText">
                      Yehaww LLC assumes no responsibility or liability for any
                      content on the website www.Yehaww.com posted by users or
                      members. The information, data and text that has been
                      submitted, posted, displayed or distributed on our site or
                      through our services is entirely the responsibility of our
                      members and users on the website. NEVER apply for a
                      position directly via email, ONLY through the website
                      www.yehaww.com. In connection with employment and any
                      agreement entered between employers or providers and
                      candidates, users agree to conduct all necessary due
                      diligence. The information on this website is provided on
                      an “as is” basis with no given representation or
                      guarantees by Yehaww LLC, as to the performance,
                      suitability, entitlement or character of any employer,
                      candidate, user or position posted on www.yehaww.com
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
const candidateAcknowledgeEmail = ({ mailData }) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="x-apple-disable-message-reformatting" />
      <title>Document</title>
      <title></title>
      <link
        href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700"
        rel="stylesheet"
      />
      <style>
        html,
        body {
          padding: 0;
          width: 100%;
          margin: 0 auto;
          background: #ebe8e2;
          font-family: "Poppins", sans-serif;
  
        }
  
        * {
          margin: 0;
          padding: 0;
          text-decoration: none;
          box-sizing: border-box;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
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
          margin: 0 auto !important;
          border-spacing: 0 !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }
  
        img {
          -ms-interpolation-mode: bicubic;
        }
  
        *[x-apple-data-detectors],
        .unstyle-auto-detected-links *,
        .aBn {
          color: inherit !important;
          cursor: default !important;
          border-bottom: 0 !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
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
          font-size: 29px;
          font-weight: 600;
          color: #424b49;
        }
  
        .imgLogo {
          width: 310px;
        }
  
        .img1 {
          width: 40px;
          height: 40px;
          margin-right: 15px;
        }
  
        .footerP {
          font-size: 16px;
          color: #424b49;
          font-weight: 400;
        }
  
        .middleBg {
          margin: 0px 30px;
          border-radius: 7px;
          padding: 40px 20px;
          background-color: #ffffff;
        }
  
        .imgDiv {
          display: flex;
          align-items: center;
          justify-content: center;
        }
  
        .innerImg {
          width: 140px;
          display: block;
          margin: 0 auto;
        }
  
        .jobImg {
          width: 117px;
          height: 100px;
          border-radius: 10px;
        }
  
        .centerTopText {
          font-size: 18px;
          font-weight: 600;
          margin-top: 20px;
          color: #252525;
          text-align: center;
        }
  
        .welcomeSpan {
          font-size: 18px;
          color: #b19e85;
          font-weight: 600;
        }
  
        .borderDiv {
          max-width: 300px;
          margin: 20px auto;
          border-bottom: 2px solid #e6e6ea;
        }
  
        .jobDiv {
          gap: 10px;
          height: 100%;
          max-width: 215px;
          padding: 30px 40px;
          border-radius: 6px;
          align-items: center;
          justify-content: center;
          margin: 20px auto 20px 0;
          border: 1px solid #e6e6ea;
          background-color: #e4e4e44f;
        }
  
        .titleText {
          font-size: 13px;
          color: #252525;
          font-weight: 400;
          text-align:center
        }
  
        .lineDiv {
          max-width: 600px;
          margin: 20px auto;
          border-bottom: 1px solid #e6e6ea;
        }
  
        .textClass {
          font-size: 18px;
          color: #252525;
          font-weight: 400;
          margin-top: 20px;
        }
        
        .textClass1 {
          font-size: 18px;
          color: #252525;
          font-weight: 400;
          text-align:center;
          display:flex;
          justify-content:center;
          align-items:center;

        }
  
        .marginClass {
          font-size: 18px;
          color: #252525;
          font-weight: 400;
        }
  
        .aTag {
          color: #252525;
          font-weight: 600;
        }
  
        .view {
          margin-top: 20px;
        }
  
        .italicText {
          font-style: italic;
        }
        .btnClass {
          height: 50px;
          margin: 20px auto; 
          width: 70%; 
          margin-top: 20px;
          border-radius: 3px;
          align-items: center !important;
          justify-content: center !important; 
          text-align: center;
          background: #b09d83;
          border: 1px solid #b09d83;
        }
        .titleDiv {
          text-align: center;
          flex-direction: column;
          width:max-content;
          align-items: center !important;
          justify-content: center;
          margin: 50px auto;
        }
        .viewBtnClass {
          width: max-content; 
          display: flex; 
          border-radius: 4px; 
          align-items: center;
          justify-content: center; 
          border: 1px solid #b29e85; 
        }
        .jobIdClass{
          margin-top: -10px;
          font-size: 8.5px;
          color: #9a9a9a;
        }
        .cardLineDiv{
          width: 100%;
          margin:10px 0px;
          border-bottom: 0.5px solid #e4e4e4;
        }
        .btnText{
          font-size:15px; 
          font-weight:600; 
          margin: 13px 0px;
          color:#fff;
        }
      </style>
    </head>
    <body width="100%" style="mso-line-height-rule: exactly; padding: 30px 20px">
      <div
        style="max-width: 800px; margin: 0 auto; width: 100%; background: #ebe8e2"
      >
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
                    <a href="https://www.yehaww.com" style="display: inline-flex"
                      ><img
                        src="${process.env.DOMAIN_API}/Images/site-logo.png"
                        class="imgLogo"
                    /></a>
                    <h1 class="heading1">
                      Hi <span class="spanClass">${mailData?.applicantName}, </span>
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
              border="0"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              >
                <tr>
                  <td>
                    <div class="middleBg">
                      <div class="imgDiv">
                        <img
                          alt=""
                          class="innerImg"
                          src="${process.env.DOMAIN_API}/Images/document.svg"
                        />
                      </div>
                      <div class="titleDiv">
                        <p class="marginClass">
                          Application Acknowledgement for
                          <p class="aTag" style="font-size: 18px; margin-left: 5px;">${
                            mailData?.jobTitle
                          }</p>
                        </p>
                      </div>
                      <div class="borderDiv"></div>
                      <p class="marginClass">
                        Your application to the following advert has been
                        received:
                      </p>
                      <div class="jobDiv">
                        <img
                        alt=""
                        class="jobImg"
                        style="padding: 7px"
                        src=${mailData?.jobImg || `${process.env.DOMAIN_API}/Images/logo.webp`}
                        />
                        <p class="titleText">${mailData?.jobTitle}</p>
                        <p class="titleText jobIdClass">
                          JOB ID: ${mailData?.jobNo}
                        </p>
                        <div class="cardLineDiv"></div>
                        <div class="viewBtnClass">
  
                          <p style="padding: 7px; margin-left:6px; font-size: 13px;width:100%">
                            <a
                            class="aTag"
                            target="_blank"
                            style="color: #b29e85;
                            width:100%"
                            href="${process.env.DOMAIN}/jobs/details/${mailData?.jobId}"
                            >View Full Details</a
                            >
                          </div>
                        </p>
                      </div>
                      <p class="textClass">
                        The recruiter will be reviewing your details and will be
                        in touch if you are shortlisted. Unfortunately, due to the
                        volume of applications, only successful candidates will be
                        contacted.
                      </p>
                      <p class="textClass">Best of luck with your job search.</p>
                      <div class="btnClass">
  <div class="btnText">
    <a style="color:#fff" href="${process.env.DOMAIN}/jobs">See Our Latest Jobs And Positions</a>
  </div>
</div>
                      <p class="textClass">Best Regards</p>
                      <p class="marginClass">Yehaww Team</p>
                      <div class="lineDiv"></div>
                      <p class="textClass">Disclaimer</p>
                      <p class="textClass italicText">
                        Yehaww LLC assumes no responsibility or liability for any
                        content on the website www.Yehaww.com posted by users or
                        members. The information, data and text that has been
                        submitted, posted, displayed or distributed on our site or
                        through our services is entirely the responsibility of our
                        members and users on the website. NEVER apply for a
                        position directly via email, ONLY through the website
                        www.yehaww.com. In connection with employment and any
                        agreement entered between employers or providers and
                        candidates, users agree to conduct all necessary due
                        diligence. The information on this website is provided on
                        an “as is” basis with no given representation or
                        guarantees by Yehaww LLC, as to the performance,
                        suitability, entitlement or character of any employer,
                        candidate, user or position posted on www.yehaww.com
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
                      ><img
                        src="${process.env.DOMAIN_API}/Images/facebook.png"
                        class="img1"
                    /></a>
                    <a
                      href="https://www.instagram.com/yehaww_com/"
                      target="_blank"
                      ><img
                        src="${process.env.DOMAIN_API}/Images/insta.svg"
                        class="img1"
                    /></a>
                    <a
                      href="https://www.linkedin.com/company/yehaww/"
                      target="_blank"
                      ><img
                        src="${process.env.DOMAIN_API}/Images/Linkdin.svg"
                        class="img1"
                        style="margin-right: 0px"
                    /></a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style="text-align: center; padding: 30px 0px">
                      <p class="footerP">Yehaww LLC</p>
                      <p class="footerP">
                        <a href="mailto:info@yehaww.com" target="_blank"
                          >info@yehaww.com</a
                        >
                        |
                        <a href="https://www.yehaww.com/" target="_blank"
                          >yehaww.com</a
                        >
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

const expiryAlertTemplate = ({ employerName, jobName, jobId }) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    <meta name="viewport" content="width=device-width" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="x-apple-disable-message-reformatting" />
    <title>Document</title>
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
      .lineDiv {
        border-bottom: 1px solid #e6e6ea;
        max-width: 600px;
        margin: 20px auto;
      }
      .textClass {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
      }
      .marginClass {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
      }
      .aTag {
        color: #024cba;
        font-weight: 600;
      }
      .view {
        margin-top: 20px;
      }
      .italicText {
        font-style: italic;
      }
    </style>
  </head>
  <body width="100%" style="mso-line-height-rule: exactly; padding: 30px 20px">
    <div
      style="max-width: 800px; margin: 0 auto; width: 100%; background: #ebe8e2"
    >
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
                  <a href="https://www.yehaww.com" style="display: inline-flex"
                    ><img
                      src="${process.env.DOMAIN_API}/Images/site-logo.png"
                      class="imgLogo"
                  /></a>
                  <h1 class="heading1">
                    Dear
                    <span class="spanClass">${employerName}, </span>
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
                    <p class="textClass">Hi!</p>
                    <p class="marginClass" style="padding-top: 30px">
                      We are sending you this email to let you know that your
                      job post
                      <a
                        href="${process.env.DOMAIN}/candidate/active-post?jobId=${jobId}"
                        class="aTag"
                        target="_blank"
                        >${jobName}</a
                      >
                      on Yehaww is about to expire due to inactivity or reaching
                      the 30 days limit.
                    </p>
                    <p class="textClass" style="padding-top: 30px" >
                      If your position is still available, you can edit your
                      post within 5 days to automatically extend the expiration
                      date of the post.
                    </p>
                    <p class="textClass">
                      To edit a post on Yehaww go to

                      <a
                        href="${process.env.DOMAIN}/candidate/search"
                        class="aTag"
                        target="_blank"
                        >“Find Candidates”,</a
                      >
                      click on
                      <a
                        href="${process.env.DOMAIN}/candidate/active-post"
                        class="aTag"
                        target="_blank"
                        >“Active Posts”,</a
                      >
                      find the job you want to extend and simply click on Edit.
                    </p>
                    <p class="textClass">
                      When you post a job on the platform it will automatically
                      expire after 30 days. If the position isn't filled, you
                      can easily extend it simply by editing. Any small edit
                      will extend your post with an additional 30 days.
                    </p>
                    <p class="textClass" style="margin-top: 20px">Best Regards</p>
                    <p class="marginClass">Yehaww Team</p>
                    <div class="lineDiv"></div>
                    <p class="textClass">Disclaimer</p>
                    <p class="textClass italicText">
                      Yehaww LLC assumes no responsibility or liability for any
                      content on the website www.Yehaww.com posted by users or
                      members. The information, data and text that has been
                      submitted, posted, displayed or distributed on our site or
                      through our services is entirely the responsibility of our
                      members and users on the website. NEVER apply for a
                      position directly via email, ONLY through the website
                      www.yehaww.com. In connection with employment and any
                      agreement entered between employers or providers and
                      candidates, users agree to conduct all necessary due
                      diligence. The information on this website is provided on
                      an “as is” basis with no given representation or
                      guarantees by Yehaww LLC, as to the performance,
                      suitability, entitlement or character of any employer,
                      candidate, user or position posted on www.yehaww.com
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

const paymentFailedEmailTemplate = ({ employerName, date }) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    <meta name="viewport" content="width=device-width" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="x-apple-disable-message-reformatting" />
    <title>Document</title>
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
      .lineDiv {
        border-bottom: 1px solid #e6e6ea;
        max-width: 600px;
        margin: 20px auto;
      }
      .textClass {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
      }
      .textClassTop {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
        text-align: center;
      }
      .marginClass {
        color: #252525;
        font-size: 18px;
        font-weight: 400;
      }
      .aTag {
        color: #024cba;
        font-weight: 600;
      }
      .view {
        margin-top: 20px;
      }
      .italicText {
        font-style: italic;
      }
      .btnText {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
      .btn {
        width: 400px;
        height: 45px;
        padding: 10px;
        border-radius: 10px;
        background-color: #b09d83;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 600;
        color: #fff;
      }
      .hazardDiv {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
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
                    ><img src="${process.env.DOMAIN_API}/Images/site-logo.png" class="imgLogo"
                  /></a>
                  <h1 class="heading1">
                    Hi
                    <span class="spanClass">${employerName}, </span>
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
                    <div class="hazardDiv">
                      <img
                        src="${process.env.DOMAIN_API}/Images/hazard.svg"
                        class="img1"
                        style="margin-right: 0px"
                      />
                    </div>
                    <p class="textClassTop" style="padding-top: 30px">
                      <b style="color: #b09d83">Yehaww</b> - Subscription Payment Failed –
                      <b> Action Required</b>
                    </p>
                    <div class="borderDiv"></div>
                    <p class="textClass">Hi!</p>
                    <p class="marginClass" style="padding-top: 30px">
                      We hope you're doing well. We regret to inform you that the payment for your
                      subscription on ${date} was <b>unsuccessful.</b>
                    </p>
                    <p class="textClass" style="padding-top: 30px">
                      To ensure uninterrupted access to Yehaww, please update your payment
                      information and retry the payment as soon as possible.
                    </p>
                    <p class="textClass" style="padding-top: 30px">
                      If you need assistance or have any questions, feel free to reach out to our
                      support team at <b>info@yehaww.com.</b>
                    </p>

                    <p class="textClass" style="margin-top: 20px">Best Regards</p>
                    <p class="marginClass">Yehaww Team</p>
                    <div class="lineDiv"></div>
                    <div class="btnText">
                      <a class="btn" style="color: #fff" href="${process.env.DOMAIN}/subscription"
                        >Retry Payment</a
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
                    <img src="${process.env.DOMAIN_API}/Images/facebook.png" class="img1" />
                  </a>
                  <a href="https://www.instagram.com/yehaww_com/" target="_blank">
                    <img src="${process.env.DOMAIN_API}/Images/insta.svg" class="img1" />
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

module.exports = {
  uploadFile,
  deleteImage,
  validateCity,
  salaryOptions,
  emailAlertTemplate,
  expiryAlertTemplate,
  handleSingleJobMapping,
  paymentFailedEmailTemplate,
  candidateAcknowledgeEmail,
  activePostsFrontEndFormat,
};
