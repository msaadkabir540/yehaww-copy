import { useState, useEffect } from "react";

import Loading from "components/loading";

import { getPrivacyPolicyData } from "api-services/general-pages";

import style from "./question.module.scss";

const QuestionSection = () => {
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState("");

  useEffect(() => {
    getPrivacyPolicyData({ setLoader, setData });
  }, []);

  return (
    <>
      <div className={style.main}>
        {loader ? (
          <Loading pageLoader={true} />
        ) : (
          <div className={style.article}>
            <p className={style.p}>
              Welcome to Yehaww and our website at{" "}
              <a href="https://www.yehaww.com/"> www.yehaww.com!</a> At Yehaww we are committed to
              protecting and respecting your privacy when you use our website and our Services.
            </p>
            <p className={style.p}>
              In principle, we will only use your Personal Data in accordance with applicable data
              protection laws, in particular Florida Information Protection Act of 2014 (“FIPA”),
              the General Data Protection Regulation (“GDPR”), and only as described in this Privacy
              Policy.
            </p>
            <p className={style.p}>
              This Privacy Policy describes our privacy practices in plain language, keeping legal
              and technical jargon to a minimum, to make sure you understand the information
              provided. However, to achieve this objective we would like to explain you the
              following three concepts.
            </p>
            <p className={style.heading}>What is Personal Data?</p>
            <p className={style.p}>
              "Personal Data" means any information relating to an identified or identifiable
              natural person (hereinafter "data subject"); an identifiable natural person is one who
              can be identified, directly or indirectly, in particular by reference to an identifier
              such as a name, an identification number, location data, an online identifier (e.g.
              cookie or an IP Address) or to one or more factors specific to the physical,
              physiological, genetic, mental, economic, cultural or social identity of that natural
              person.
            </p>
            <p className={style.heading}>What is Special Category Data?</p>
            <p className={style.p}>
              Special category data is Personal Data that needs more protection because it is
              sensitive. This includes Personal Data revealing racial or ethnic origin, political
              opinions, religious or philosophical beliefs, trade union membership, genetic data,
              biometric data. As well as, data concerning health, a person’s sex life; and a
              person’s sexual orientation. In order to lawfully process Special Category Data, it is
              necessary to consent to the processing.
            </p>
            <p className={style.heading}>What is Processing?</p>
            <p className={style.p}>
              "Processing" means any operation or set of operations which is performed upon Personal
              Data, whether or not by automatic means. The term is broad and covers virtually any
              handling of data.
            </p>
            <p className={style.bold}>The Person responsible (“Data Controller”)</p>
            <p>Responsible for data processing is:</p>
            <p className={style.address}>
              Yehaww LLC <br />
              5481 Wiles Rd suite 502, <br />
              Pompano Beach, <br />
              FL 33073, USA <br />
            </p>
            <p className={style.bold}>Purpose and legal basis of processing</p>
            <p className={style.p}>
              In accordance with the FIPA and the GDPR we need to have both a purpose and a legal
              basis to process Personal Data. The purposes are:
            </p>
            <li className={style.second}>
              the provision of the website and shop and their functions and contents,
            </li>
            <li className={style.second}>
              responding to contact requests and communicating with users,
            </li>
            <li className={style.second}>providing our services, and</li>
            <li className={style.second}>security measures.</li>
            <br />
            <p className={style.p}>
              Of course, we can only do that if we have at least one of the following legal bases or
              in other words lawful reasons to do so. Unless specifically described below, we
              typically link the above purposes to one of the following:
            </p>
            <li className={style.second}>
              <i>Consent:</i> the individual has given clear consent to process Personal Data for a
              specific purpose.
            </li>
            <li className={style.second}>
              <i>Contract:</i> the processing is necessary for a contract or because you have asked
              us to take specific steps before entering into a contract.
            </li>
            <li className={style.second}>
              <i>Legal obligation:</i> the processing is necessary for us to comply with the law
              (not including contractual obligations).
            </li>
            <li className={style.second}>
              <i>Legitimate interests:</i> the processing is necessary for our legitimate interests
              or the legitimate interests of a third party, unless there is a good reason to protect
              your Personal Data which overrides those legitimate interests.
            </li>
            <br />
            <p className={style.bold}>General Principles</p>
            <li className={style.first}>Security</li>
            <p className={style.p}>
              Our website uses SSL or TLS encryption to ensure the security of data processing and
              to protect the transmission of confidential content, such as orders, login data or
              contact requests that you send to us.
            </p>
            <p className={style.p}>
              You can recognize an encrypted connection if the address line of your browser contains
              a "https://" instead of a "http://" and also has a lock symbol. If SSL or TLS
              encryption is activated, the data you transmit to us cannot be read by third parties.
            </p>
            <p className={style.p}>
              We have also implemented numerous security measures (“technical and organizational
              measures”) to ensure the most complete protection of Personal Data processed through
              this website. Nevertheless, internet-based data transmissions can always have security
              gaps, so that absolute protection cannot be guaranteed. And databases or data sets
              that include Personal Data may be breached inadvertently or through wrongful
              intrusion.
            </p>
            <p className={style.p}>
              Upon becoming aware of a data breach, we will notify all affected individuals whose
              Personal Data may have been compromised, and the notice will be accompanied by a
              description of the action being taken to reconcile any damage as a result of the data
              breach. Notices will be provided as expeditiously as possible after which the breach
              was discovered.
            </p>
            <li className={style.first}>Retention and Storage</li>
            <p className={style.p}>
              We will retain your Personal Data as necessary in connection with the purposes
              described in this Privacy Policy, and in accordance with Florida`s retention periods
              if applicable. In the course of our business operations, your data is generally
              transferred to our{" "}
              <a href="https://aws.amazon.com/privacy/">Amazon Web Services (AWS)</a> USA server.
            </p>
            <li className={style.first}>Minors</li>
            <p className={style.p}>
              When it comes to the collection of Personal Data from children under the age of 13
              years, the Children’s Online Privacy Protection Act (COPPA) puts parents in control.
              The Federal Trade Commission, United States’ consumer protection agency, enforces the
              COPPA Rule, which spells out what operators of websites and online services must do to
              protect children’s privacy and safety online. As such, we will not knowingly collect,
              use or disclose Personal Data from minors without first obtaining consent from a legal
              guardian through direct contact.
            </p>
            <li className={style.first}>Automated decision-making</li>
            <p className={style.p}>
              Automated decision-making including profiling does not take place.
            </p>
            <li className={style.first}>Do Not Sell</li>
            <p className={style.p}>
              We do not sell data to third parties. However, we might, making available, transfer,
              communicate electronically, consumer’s Personal Data by the business to a business
              affiliated inclusive with a third party but not for monetary but for other valuable
              consideration.
            </p>
            <li className={style.first}>Special Category Data</li>
            <p className={style.p}>
              Unless specifically required and explicit consent is obtained, for a particular
              service, we do not process Special Category Data.
            </p>
            <li className={style.first}>Social Media</li>
            <p className={style.p}>
              We are present on social media on the basis of our legitimate interest (currently,
              <a href="https://www.facebook.com/privacy/policy/">Facebook </a>,
              <a href="https://help.instagram.com/155833707900388">Instagram </a>
              and
              <a href="https://www.linkedin.com/legal/privacy-policy"> LinkedIn</a>
              ). If you contact or connect with us via social media platforms, we and the relevant
              social media platform are jointly responsible for the processing of your data and
              enter into a so-called joint controller agreement. The legal basis for the use of the
              relevant social media platform is our legitimate interest, your consent or, in the
              case of a (pre) contractual relationship with us, the initiation of a contractual
              service, if any.
            </p>
            <li className={style.first}>Recipients outside the USA</li>
            <p className={style.p}>
              We may transfer your Personal Data to other companies and/or business partners as
              necessary for the purposes described in this Privacy Policy. In doing so, your
              Personal Data may be transferred to countries outside the USA. In order to provide
              adequate protection for your Personal Data when it is transferred, we have contractual
              arrangements regarding such transfers. We take all reasonable technical and
              organizational measures to protect the Personal Data we transfer.
            </p>
            <p className={style.bold}>Processing of Automatically Collected Data</p>
            <i>a) Hosting </i>
            <p className={style.p}>
              To provide our website, we use the services of
              <a href="https://www.siteground.co.uk/privacy.htm"> SiteGround Hosting </a>
              who process the below-mentioned data and all data to be processed in connection with
              the operation of our website on our behalf. The legal basis for the data processing is
              our legitimate interest in providing our website.
            </p>
            <i>b) Collection of access data and log files </i>
            <p className={style.p}>
              We, rather
              <a href="https://www.siteground.co.uk/privacy.htm"> SiteGround Hosting </a>
              on our behalf, also collects data on every access to our website. The access data
              includes the name of the website accessed, file, date and time of access, amount of
              data transferred, notification of successful access, browser type and version, the
              user's operating system, referrer URL (the previously visited page), IP address and
              the requesting provider.
            </p>
            <p className={style.p}>
              Log file information is stored for security reasons (e.g., for the clarification of
              abuse or fraud) for a maximum of 12 days and then deleted. Data whose further storage
              is necessary for evidentiary purposes is exempt from deletion until the respective
              incident is finally clarified. The legal basis for the data processing is our
              legitimate interest in providing an appealing website.
            </p>
            <i>c) Use of cookies</i>
            <p className={style.p}>
              We use so-called cookies on our web site. Cookies are small text files that are stored
              on your respective device (PC, smartphone, tablet, etc.) and saved by your browser.
              For further information please refer to our Cookie Policy. The legal basis for the use
              of cookies is your consent as well as our legitimate interest.
            </p>
            <p className={style.bold}>
              Data processing when you submit it to our website and when you use our services
            </p>
            <p className={style.p}>
              When you contact us through our website or use our services, some data is collected
              and processed by us or on our behalf by our selected third-party providers.
            </p>
            <i>a) Contacting us</i>
            <p className={style.p}>
              If you contact us, we process the following data from you for the purpose of
              processing and handling your request: first name, last name, e-mail address, and, if
              applicable, other information if you have provided it, and your message. The legal
              basis for the data processing is our obligation to fulfill the contract and/or to
              fulfill our pre-contractual obligations and/or our overriding legitimate interest in
              processing your request.
            </p>
            <i>b) Data management and customer support</i>
            <p className={style.p}>
              For optimal customer support, we use first name, last name, e-mail address, and the
              data related to your contract with us. Your data will be stored on our website and or
              our customer relationship management system ("CRM system"). This data processing is
              based on our legitimate interest in providing our service.
            </p>
            <i>c) Account registration </i>
            <p className={style.p}>
              When you register on our platform, we request mandatory and, where applicable,
              non-mandatory data from both Influencers and Companies in accordance with our
              registration form. The entry of your data is encrypted so that third parties cannot
              read your data as it is entered. The basis for this storage is our legitimate interest
              in communicating with registered users and, in the case of contracts, also storing
              contract data.
            </p>
            <i>d) Contract processing when using our services</i> <br />
            <i>i) Candidate Data</i>
            <p className={style.p}>
              We need to process certain information about you in order to provide you with optimal,
              tailored employment opportunities. We only ask for information that we believe will
              actually help us to serve you better, such as your name, age, contact details,
              education details, employment history, emergency contacts, residency status, financial
              information. Where appropriate and permitted by laws and regulations, we will also
              collect information about your health, diversity information or details of any
              criminal record.
            </p>
            <i>ii) Potential Candidate Data</i>
            <p className={style.p}>
              If we believe that you may be interested in our services or that they may be of
              benefit to you, we will collect and use this information about you to evaluate how we
              might help you and contact you. We also collect certain information about you when you
              access our website or click on a link in an email we send.
            </p>
            <i>iii) Client Data</i>
            <p>
              If you are a client, we may need to collect and use information about you or
              individuals within your organization in order to provide or offer services to you,
              such as:
            </p>
            <li className={style.second}>search for candidates who are a good match for you or</li>
            <li className={style.second}>
              providing a managed service provider program to you (or assisting another organization
              to do so),
            </li>
            <li className={style.second}>
              providing recruitment process outsourcing services to you (or assisting another
              organization to do so),
            </li>
            <li className={style.second}>
              providing services to your employees such as training, and/or
            </li>
            <li className={style.second}>
              notifying you of content published by us that is likely to be important and useful to
              you.
            </li>
            <p className={style.p}>
              In all cases, the legal basis for the data processing is the fulfillment of our
              contractual obligations and, in individual cases, the fulfillment of our legal
              obligations as well as your Consent.
            </p>
            <p className={style.p}>
              Some of the Personal Data you provide may be considered “special” or “sensitive”, for
              example your racial or ethnic origins, sexual orientation, and religious beliefs. By
              choosing to provide this data, you consent to our processing of that data.
            </p>
            <p className={style.p}>
              Where any Personal Data relates to a third party, you represent and warrant that the
              Personal Data is up-to-date, complete, and accurate and that you have obtained the
              third party’s prior consent for our collection, use and disclosure of their Personal
              Data for the Purposes. You agree that you shall promptly provide us with written
              evidence of such consent upon demand by us.
            </p>
            <p className={style.p}>
              You may withdraw your consent and request us to stop using and/or disclosing your
              Personal Data for any or all of the Purposes by submitting your request to us.
            </p>
            <i>e) Administration, financial accounting, office organization, contact management</i>
            <p className={style.p}>
              We process data in the context of administrative tasks as well as organization of our
              operations, financial accounting and compliance with legal obligations, such as
              archiving. In this regard, we process the same data that we process in the course of
              providing our contractual services (point c) and b) above). The purpose and our
              interest in the processing lies in the administration, financial accounting, office
              organization, archiving of data, i.e., tasks that serve the maintenance of our
              business activities, performance of our tasks and provision of our services.
              Furthermore, based on our business interests, we store information on suppliers, and
              other business partners, e.g., for the purpose of contacting them at a later date.
              This data, most of which is company-related, is generally stored permanently.
            </p>
            <i>f) Financial Data</i>
            <p className={style.p}>
              If you make a purchase your payment will be processed via the payment service provider
              <a href="https://stripe.com/gb/privacy"> Stripe</a>. Payment data will solely be
              processed through the payment system of Stripe. The legal basis for the provision of a
              payment system is the establishment and implementation of the user contract for the
              use of the service.
            </p>
            <i>g) Newsletter</i>
            <p className={style.p}>
              If you register for our newsletter, we will regularly send you information about our
              services. The only data required or sending the newsletter is your e-mail address. We
              use the so-called double opt-in procedure for sending the newsletter. This means that
              we will only send you an e-mail newsletter once you have expressly confirmed that you
              consent to receiving newsletters. By activating the confirmation link, you give us
              your consent.
            </p>
            <p className={style.p}>
              You can unsubscribe from the newsletter at any time via the link provided for this
              purpose in the newsletter or by sending a corresponding message to the responsible
              person named at the beginning. After unsubscribing, your e-mail address will be
              deleted from our newsletter distribution list immediately. The legal basis for the
              data processing is your consent and our legitimate interest.
            </p>
            <p className={style.bold}>How will your Personal Data be used?</p>
            <li className={style.first}>Candidate Data</li>
            <p className={style.p}>
              The main reason we use your Personal Data is to help you find employment or other
              suitable employment. The more information we have about you, your skills, and your
              goals, the better we can tailor our service to you. Where appropriate and permitted by
              laws and regulations, we will also use your Personal Data to advertise our services to
              you, profiling, and diversity monitoring, etc. We may ask you to provide us with more
              information about yourself. Where appropriate, we will ask for your consent to do some
              of these things.
            </p>
            <li className={style.first}>Potential Candidates</li>
            <p className={style.p}>
              We use information about potential candidates to determine whether you are interested
              in or may benefit from our services. If this is the case, we will assess whether and
              how we could help you. If we think we can help you, we will use your information to
              contact you about our services.
            </p>
            <li className={style.first}>Client Data</li>
            <p className={style.p}>
              The main reason we use information about clients is to be able to introduce ourselves
              to you and to ensure that the contractual arrangements between us can be properly
              implemented to ensure a smooth business relationship. This will include:
            </p>
            <li className={style.second}>
              identifying candidates that we believe are a good fit for you or your organization,
            </li>
            <li className={style.second}>
              providing services to you (or supporting another organization in doing so,
            </li>
            <li className={style.second}>providing services to your staff such as training.</li>
            <p className={style.p}>
              The more information we have, the better we can tailor our service to you.
            </p>
            <p className={style.bold}>Sharing of Personal Data</p>
            <p className={style.p}>
              We will not disclose or otherwise distribute your Personal Data to third parties
              unless this:
            </p>
            <li className={style.second}>is necessary for the performance of our services,</li>
            <li className={style.second}>you have consented to the disclosure,</li>
            <li className={style.second}>
              or the disclosure of data is permitted by relevant legal provisions.
            </li>
            <i>a) Candidate Data</i>
            <p className={style.p}>
              We will share your Personal Data with different recipients in different ways and for
              different reasons. First and foremost, we will share your information with potential
              employers to increase your chances of getting the job you want. Unless you have
              indicated otherwise, we will also share your information with any of our group
              companies as well as related third parties, such as service providers we use and
              selected job search engines, if we believe this will help us to provide the best
              service to you and maximize your chances of getting the job you want.
            </p>
            <i>b) Potential Candidate Data</i>
            <p className={style.p}>
              If you have been identified as a potential candidate, we may share your information
              with all group companies and related third parties, such as service providers we use,
              in order to contact you about our services.
            </p>
            <i>c) Client Data</i>
            <p className={style.p}>We share your data for the following purposes:</p>
            <li className={style.second}>
              primarily to ensure that we can provide you with access to an appropriate pool for
              candidates,
            </li>
            <li className={style.second}>
              to provide (or assist another organization to provide) services to you and/or
            </li>
            <li className={style.second}>
              to provide services to your employees such as training.
            </li>
            <p className={style.p}>
              Unless you have indicated otherwise, we will share your information with any of our
              group companies as well as related third parties, such as service providers we use, in
              order to better achieve these objectives.
            </p>
            <p className={style.p}>
              However, we are entitled to outsource the processing of your Personal Data in whole or
              in part to external service providers acting as processors. External service providers
              support us, for example, in the technical operation and support of the website, data
              management, the provision and performance of services, marketing, as well as the
              implementation and fulfillment of reporting obligations.
            </p>
            <p className={style.p}>
              The service providers commissioned by us however will process your data exclusively in
              accordance with our instructions and we remain responsible for the protection of your
              data. Doing so we always make sure that service providers commissioned by us are
              carefully selected, follow strict contractual regulations, technical and
              organizational measures, and additional controls by us.
            </p>
            <p className={style.p}>
              We may also disclose Personal Data to third parties if we are legally obliged to do so
              e.g., by court order or if this is necessary to support criminal or legal
              investigations or other legal investigations or proceedings at home or abroad or to
              fulfill our legitimate interests.
            </p>
            <p className={style.bold}>Equality monitoring and other Sensitive Personal Data</p>
            <p className={style.p}>
              We want to ensure that our recruitment processes are consistent with our approach to
              equality. Some of the data we collect about you (in certain circumstances and in
              accordance with local laws and regulations) falls within the scope of 'diversity
              information'. This may be information about your ethnic background, gender,
              disabilities, age, sexual orientation, religion, or similar beliefs and/or
              socio-economic background. This diversity information is considered "sensitive" or
              "specially categorized" personal information and is subject to stricter data
              protection rules.
            </p>
            <p className={style.p}>
              Where appropriate and in accordance with local regulations and requirements, we will
              use this information in anonymized form to monitor whether we are complying with our
              Equality Policy. We will also provide this information (appropriately anonymized where
              appropriate) to clients (including their internal or external auditors) where
              contractually agreed or where the client specifically requests this information in
              order to comply with their own employment processes.
            </p>
            <p className={style.p}>
              We may collect other sensitive/special categorization personal information about you,
              such as health or religious affiliation information, where permitted by local law. In
              these circumstances, we will use this information to comply with employment rights and
              obligations, such as calculating annual leave entitlement or making appropriate
              adjustments for candidates or part-time employees.
            </p>
            <p className={style.p}>
              We may also collect details of any criminal convictions were permitted by local law
              which may require us to obtain your consent. If you do not agree, you can withdraw
              your consent at any time.
            </p>
            <p className={style.bold}>Marketing</p>
            <p className={style.p}>
              Insofar as you have also given us your consent to process your Personal Data for
              marketing and advertising purposes, we are entitled to contact you for these purposes
              via the communication channels you have given your consent to.
            </p>
            <p className={style.p}>
              You consent can be obtained in a number of ways, including by selecting a box on a
              form or implied from your interactions with us or our contractual relationship.
              Implied consent however is limited to the assumption that you would have a reasonable
              expectation of receiving a marketing communication based on your interactions or
              contractual relationship with us.
            </p>
            <p className={style.p}>
              Our Marketing generally takes the form of e-mail but may also include other less
              traditional or emerging channels. Every directly addressed marketing sent by us or on
              our behalf will include a means by which you may unsubscribe or opt out.
            </p>
            <p className={style.bold}>Economic analyses and market research</p>
            <p className={style.p}>
              For business reasons and in order to be able to recognize market trends, wishes of
              contractual partners and users, we analyze the data we have on business transactions,
              contracts, inquiries, etc., whereby the group of persons concerned may include
              contractual partners, interested parties, customers, visitors, and users of our online
              offer.
            </p>
            <p className={style.p}>
              The analyses are carried out for the purpose of business evaluations, marketing, and
              market research (e.g., to determine customer groups with different characteristics).
              The analyses serve us alone and are not disclosed externally, unless they are
              anonymous analyses with summarized, i.e., anonymized values. Furthermore, we take the
              privacy of users into consideration and process the data for analysis purposes as
              pseudonymously as possible and, if feasible, anonymously (e.g., as summarized data).
            </p>
            <p className={style.bold}>Your Rights and Privileges</p>
            <li className={style.first}>Privacy rights</li>
            <p>Under the FIPA you can exercise the following rights:</p>
            <li className={style.second}>Right to Know/Access</li>
            <li className={style.second}>Right to Delete</li>
            <li className={style.second}>Right to Opt-out of Sale</li>
            <li className={style.second}>Right to Non-Discrimination</li>
            <li className={style.second}>Right to Rectification</li>
            <li className={style.second}>
              Right to Limit Use and Disclosure of Sensitive Personal Data
            </li>
            <p>Under the GDPR, you can exercise the following rights:</p>
            <li className={style.second}>Right to information</li>
            <li className={style.second}>Right to rectification</li>
            <li className={style.second}>Right to object to processing</li>
            <li className={style.second}>Right to deletion</li>
            <li className={style.second}>Right to data portability</li>
            <li className={style.second}>Right of objection</li>
            <li className={style.second}>Right to withdraw consent</li>
            <li className={style.second}>Right to complain to a supervisory authority</li>
            <li className={style.second}>
              Right not to be subject to a decision based solely on automated processing.
            </li>
            <p className={style.p}>
              If you have any questions about the nature of the Personal Data we hold about you, or
              if you wish to request the erasure or rectification of Personal Data we hold about
              you, or to exercise any of your other rights as a data subject, please contact us.
            </p>
            <li className={style.first}>Updating your information</li>
            <p className={style.p}>
              If you believe that the information, we hold about you is inaccurate or that we are no
              longer entitled to use it and want to request its rectification, deletion, or object
              to its processing, please do so by contacting us.
            </p>
            <li className={style.first}>Withdrawing your consent</li>
            <p className={style.p}>
              You can revoke consents you have given at any time by contacting us. The legality of
              the data processing carried out until the revocation remains unaffected by the
              revocation.
            </p>
            <li className={style.first}>Access Request</li>
            <p className={style.p}>
              In the event that you wish to make a Data Subject Access Request, you may inform us in
              writing of the same. We will respond to requests regarding access and correction as
              soon as reasonably possible. Should we not be able to respond to your request within
              thirty (30) days, we will tell you why and when we will be able to respond to your
              request. If we are unable to provide you with any Personal Data or to make a
              correction requested by you, we will tell you why.
            </p>
            <li className={style.first}>Complaint to a supervisory authority</li>
            <p className={style.p}>
              You have the right to complain about our processing of Personal Data to a supervisory
              authority responsible for data protection. The competent data protection authority in
              Florida is: The Office of the Attorney General for the State of Florida, PL-01 The
              Capitol, Tallahassee, FL 32399-1050.
              <a href="http://www.myfloridalegal.com/"> www.myfloridalegal.com</a>
            </p>
            <p className={style.bold}>Validity and questions</p>
            <p>
              This Privacy Policy was last updated on Saturday, March 25, 2023, and is the current
              and valid version. However, we want to point out that from time to time due to actual
              or legal changes a revision to this policy may be necessary. If you have any data
              protection questions, please feel free to contact us using
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
