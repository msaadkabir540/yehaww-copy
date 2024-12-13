import { useState, useEffect } from "react";

import Loading from "components/loading";

import { getCookiesData } from "api-services/general-pages";

import style from "./question.module.scss";

const QuestionSection = () => {
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState("");

  useEffect(() => {
    getCookiesData({ setLoader, setData });
  }, []);

  return (
    <>
      <div className={style.main}>
        {loader ? (
          <Loading pageLoader={true} />
        ) : (
          <div className={style.article}>
            <p className={style.p}>
              Welcome to Yeehaw and our website at
              <a href="http://www.yehaww.com/">www.yehaww.com</a>
              operated by Yehaww LLC of 5481 Wiles Rd suite 502, Pompano Beach, FL 33073, USA acting
              as the Data Controller.
            </p>
            <p className={style.p}>
              Below you will find more information about cookies, what they are cookies, which
              cookies do we use, what is our purpose for using them and how to block or delete
              cookies.
            </p>
            <p className={style.bold}>Why do we have a Cookie Policy?</p>
            <p className={style.p}>
              Below you will find more information about cookies, what they are cookies, which
              cookies do we use, what is our purpose for using them and how to block or delete
              cookies.
            </p>
            <p className={style.bold}>What is a cookie?</p>
            <p className={style.p}>
              Cookies are text files containing small amounts of information that are downloaded to
              your device when you visit a website. Cookies are then sent to the original website or
              to another website that recognizes this cookie on each subsequent visit. Cookies are
              useful because they allow a website to recognise a user's device.
            </p>
            <p className={style.p}>
              There are two types of cookies. One type of cookie stores a file on your device for an
              extended period of time and is used, for example, for functions that describe what
              information has been added since you last visited our website.
            </p>
            <p className={style.p}>
              A second type of cookie is a so-called "session cookie". A session cookie is
              temporarily stored on your computer while you are visiting our website.
            </p>
            <p className={style.p}>
              Session cookies are not stored on your computer for a longer period of time but are
              deleted immediately when you close your internet browser. You can find more
              information about cookies at
              <a href="http://www.allaboutcookies.org/"> www.allaboutcookies.org</a>.
            </p>
            <p className={style.bold}>What do we use cookies for?</p>
            <p className={style.p}>
              We use cookies to improve the functionality of our website. For example, cookies help
              authenticate the user, information can be stored in a cookie so that the user can
              enter and leave the website without having to enter the same information over and over
              again. Cookies are also used to help you store certain information on the website,
              such as favorite products, etc. They are also used to collect anonymous statistics
              about user behavior so that we can make better use of the website.
            </p>
            <p className={style.bold}>Cookies used on our website</p>
            <p className={style.p}>
              We have divided our cookies and third-party cookies into two classes and several
              subcategories:
            </p>
            <li className={style.first}>Essential Cookies</li>
            <p className={style.p}>
              These cookies are necessary for good website functionality and cannot be turned off in
              our systems. They are usually only set based on your behavior in relation to selected
              features, such as choosing your privacy settings, logging in or filling in forms. You
              can set your browser to block these cookies or to alert you to them. However, this
              will cause some parts of the website to stop working. These cookies do not store any
              personal data.
            </p>
            <li className={style.first}>Non- Essential Cookies</li>
            <li className={style.second}>Performance cookies</li>
            <p className={style.p}>
              Performance cookies allow us to count visits and entry pages, which is an important
              source of information for improving our website. They help us to know which pages are
              most and least popular and to see how visitors move around the site. All the
              information these cookies collect is aggregated and is anonymous. If you do not agree
              to these cookies, we will not know when you have visited our website and will not be
              able to monitor the performance of our website.
            </p>
            <li className={style.second}>Functional cookies</li>
            <p className={style.p}>
              Functional cookies enable the website to offer improved functionality and
              personalization. They may be set by us or by third parties whose services we have
              added to our pages. If you do not allow these cookies, some or all of these services
              may not work properly. Third party service providers may process your information,
              including personal data, when these cookies are enabled.
            </p>
            <li className={style.second}>Marketing cookies</li>
            <p className={style.p}>
              Targeted cookies may be set through our website by our advertising partners. They may
              be used by these companies to profile your interests and show you relevant advertising
              on other websites. They are based on the unique identification of your browser type
              and the type of internet device you are using. If you do not allow these cookies, you
              will receive less targeted advertising.
            </p>
            <li className={style.second}>Social media cookies</li>
            <p className={style.p}>
              Social media cookies are set by a number of social media services that we have added
              to the website to enable you to share our content with your friends and networks. They
              are able to track your browser on other websites and build a profile of your
              interests. This may affect the content and messages you see on other websites you
              visit. If you do not agree to these cookies, you may not be able to use or see these
              sharing features.
            </p>
            <p className={style.p}>
              Below you will find a list of the non-essential cookies (Performance and analytics we
              use, with their name, description, lifetime, and type, so you know what you are
              consenting to. Please note that this list may be updated from time to time.
            </p>
            <li className={style.first}>_ga_*</li>
            <li className={style.second}>
              Google Analytics sets this cookie to store and count page views.
            </li>
            <li className={style.second}>1 year 1 month 4 days</li>
            <li className={style.second}>Analytics</li>
            <li className={style.first}>_ga</li>
            <li className={style.second}>
              The _ga cookie, installed by Google Analytics, calculates visitor, session and
              campaign data and also keeps track of site usage for the site's analytics report. The
              cookie stores information anonymously and assigns a randomly generated number to
              recognize unique visitors.
            </li>
            <li className={style.second}>1 year 1 month 4 days</li>
            <li className={style.second}>Analytics</li>
            <p className={style.bold}>What is Google Analytics?</p>
            <p className={style.p}>
              Google Analytics is a web analytics service offered by
              <a href="https://policies.google.com/privacy?hl=en"> Google LLC </a>
              that tracks and reports website traffic. When Google Analytics is used, interactions
              of website visitors are primarily recorded and systematically evaluated with the help
              of analytical cookies. The following data is processed through the use of Google
              Analytics:
            </p>
            <li className={style.second}>
              3 bytes of the IP address of the called system of the website visitor (anonymized IP
              address),
            </li>
            <li className={style.second}>the website called up,</li>
            <li className={style.second}>
              the website from which the user reached the accessed page of our website (referrer),
            </li>
            <li className={style.second}>the subpages accessed from the website,</li>
            <li className={style.second}>the time spent on our website, and</li>
            <li className={style.second}>the frequency with which the website is accessed.</li>
            <p className={style.p}>
              Google states that it will not associate your IP address with any other data held by
              Google. You can prevent the storage of cookies by setting your browser accordingly.
              You can also prevent the collection of the data generated by Google as well as the
              processing of this data by Google by downloading and installing the browser plugin
              available under the following link:
              <a href="https://tools.google.com/dlpage/gaoptout?hl=en">
                {" "}
                http://tools.google.com/dlpage/gaoptout?hl=en
              </a>
              .
            </p>
            <p className={style.bold}>Duration and quantity</p>
            <p className={style.p}>
              We only set the duration for our own cookies; third party cookies are set by the
              third-party providers. Please visit the websites of the external providers and read
              their cookie policies to find out more.
            </p>
            <p className={style.bold}>How to block and/or delete cookies</p>
            <p className={style.p}>
              If you do not wish to accept cookies, you can also change your web browser settings (
              <a href="https://support.google.com/chrome/answer/95647?hl=en-GB&co=GENIE.Platform%3DDesktop">
                Google Chrome
              </a>
              ,
              <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">
                {" "}
                Mozilla Firefox
              </a>
              ,
              <a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d">
                {" "}
                Microsoft Internet Edge
              </a>
              ,
              <a href="https://www.opera.com/use-cases/clean-browser-and-remove-trackers"> Opera</a>
              ,<a href="https://support.apple.com/en-gb/HT201265"> Safari</a>,) to automatically
              block the storage of cookies or to inform you when a website wishes to store cookies
              on your device.
            </p>
            <p className={style.bold}>Validity and questions</p>
            <p className={style.p}>
              This Cookie Policy was last updated on Saturday, March 25, 2023, and is the current
              and valid version. However, we want to point out that from time to time due to actual
              or legal changes a revision to this policy may be necessary. If you have any data
              protection questions, please feel free to contact us using{" "}
              <a href="mailto:info@yehaww.com">info@yehaww.com</a>, write to us at the above
              address, or call us on (+1)3054570979.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionSection;
