const jobReportAlertEmail = ({
  jobId,
  reason,
  jobLink,
  jobTitle,
  description,
  employerName,
  reporterName,
  employerEmail,
  reporterEmail,
  reporterPhone,
}) => {
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
        font-weight: 600;
        color: #424b49;
      }
      .spanClass {
        font-weight: 600;
        font-size: 29px;
        color: #424b49;
        display: block;
  margin-left: auto;
  margin-right: auto;
      }
      .heading2 {
        font-size: 20px;
        font-weight: 400;
        color: #B29E85;
      }
      .strongHead {
        margin-top: 20px;
        color: #424b49;
        font-size: 23px !important;
      }
      .spanClass2 {
        font-weight: 600;
        font-size: 23px;
        color: #B29E85;
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
      .keyClass {
      margin-left: 12px;
        color: #252525;
        font-size: 18px;
        font-weight: 600;
        margin-top: 20px;
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
        width: 100%;
      }
      .aTag1 {
        text-decoration: none;
        background: #b09d83;
        border-radius: 6px;
        padding: 15px 0;
        font-size: 26px;
        font-weight: 600;
        display: block;
        color: #fff !important;
        width: 100%;
        text-align: center;
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
                    src="${process.env.DOMAIN_API}/Images/alert.svg"
                        alt=""
                        class="innerImg"
                    />
                    </div>
                    <div class="imgDiv">
                      <h1 class="heading2">
                        <span class="spanClass2">Job Report Alert: ${jobTitle} - ${jobId}</span>
                      </h1>
                    </div>
                    <div class="borderDiv"></div>
                      <div class="middleBg">
                        <p class="textClass">A job posting has been reported by a user on our platform. Please review the details below and take appropriate action.</p> 
                        <h2 class="strongHead">Reported Job Information</h2> 
                       <p class="textClass"><a class="keyClass"> Job Title:</a> ${jobTitle}</p> 
                       <p class="textClass"><a class="keyClass"> Job ID: </a> ${jobId}</p> 
                      <p class="textClass"> <a class="keyClass"> Employer Name: </a> ${employerName}</p> 
                      <p class="textClass"> <a class="keyClass"> Employer Email: </a> ${employerEmail}</p> 
                        <h2 class="strongHead">Reporter Information</strong></h2> 
                      <p class="textClass"> <a class="keyClass"> Name: </a>  ${reporterName}</p> 
                      <p class="textClass"> <a class="keyClass"> Email: </a> ${reporterEmail}</p> 
                      <p class="textClass"> <a class="keyClass"> Phone Number: </a> ${
                        reporterPhone || "N/A"
                      }</p> 
                       <h2 class="strongHead">Reason for Reporting</h2> 
                       <p class="textClass">${reason}</p> 
                       <h2 class="strongHead">Detailed Description</h2> 
                       <p class="textClass">${description}</p>
                       <h2 class="strongHead">Evidence</h2> 
                       <p class="textClass">Please find the attachment.</p> 
                         <div class="btn">
                           <a class="aTag1" href="${jobLink}" target="_blank">View Job</a>
                         </div>
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

module.exports = { jobReportAlertEmail };
