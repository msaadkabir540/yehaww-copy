import { useState, useEffect } from "react";

import Loading from "components/loading";

import { getTermsConditionData } from "api-services/general-pages";

import style from "./question.module.scss";

const QuestionSection = () => {
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState("");

  useEffect(() => {
    getTermsConditionData({ setLoader, setData });
  }, []);

  return (
    <>
      <div className={style.main}>
        {loader ? (
          <Loading pageLoader={true} />
        ) : (
          <div className={style.article}>
            <p>
              This agreement applies as between you, the User of our website and Yehaww LLC of 5481
              Wiles Rd suite 502, Pompano Beach, FL 33073, USA (“Yehaww”, “we”, “us” or “our”). Your
              agreement to comply with and be bound by these Terms (these “Terms”) is deemed to
              occur upon your first use of our website. If you do not agree to be bound by these
              Terms, you should stop using our website immediately.
            </p>
            <li className={style.heading}>ACCEPTANCE</li>
            <li className={style.first}>
              Please read these Terms, our Privacy Policy, and all applicable supplemental Service
              Agreements carefully, as they contain terms and conditions that impact your rights,
              obligations, and remedies in connection with your use of our website and Services. For
              example, the terms include:
            </li>
            <li className={style.second}>
              your obligation to comply with all applicable laws and regulations.
            </li>
            <li className={style.second}>limitations of our liability to you.</li>
            <li className={style.first}>
              Your access to and use of our Services is conditioned on your acceptance of and
              compliance with all of our Terms.
            </li>
            <li className={style.first}>We reserve the right to change these Terms at any time.</li>
            <li className={style.first}>
              By accessing, browsing and/or using our website after updates to these terms have been
              posted, you agree to be bound by the updated terms.
            </li>
            <li className={style.first}>
              Your failure to comply with these Terms may result in the suspension or termination of
              your access to the Services and may subject you to civil and criminal penalties.
            </li>
            <li className={style.heading}>GENERAL CONDITIONS</li>
            <li className={style.first}>
              We do not guarantee the accuracy, completeness, validity, or timeliness of information
              listed by us.
            </li>
            <li className={style.first}>
              We make material changes to these Terms from time to time, we may notify you either by
              prominently posting a notice of such changes or via email communication.
            </li>
            <li className={style.heading}>LICENSE TO USE OUR WEBSITE</li>
            <li className={style.first}>
              We may provide you with certain information because of your use of our website. Such
              information may include but is not limited to, documentation, data, or information
              developed by us, and other materials which may assist in your use of our website ("our
              Materials").
            </li>
            <li className={style.first}>
              Subject to this Agreement, we grant you a non-exclusive, limited, non-transferable,
              and revocable license to use our Materials solely in connection with your use of our
              website. Our Materials may not be used for any other purpose, and this license
              terminates upon your cessation of use of our website or at the termination of this
              Agreement.
            </li>
            <li className={style.heading}>INTELLECTUAL PROPERTY</li>
            <li className={style.first}>
              You agree that all copyrights, trademarks, trade secrets, patents, and other
              intellectual property ("our IP") displayed on our website is the property of Yehaww or
              that of our Third-Party Licensors. You agree that we or our Third-Party Licensors own
              all rights, title, and interest in and to our IP and that you will not use our IP for
              any unlawful or infringing purpose.
            </li>
            <li className={style.first}>
              You agree not to reproduce or distribute our IP in any way, including electronically
              or via registration of any new trademarks, trade names, service marks, or Uniform
              Resource Locators (URLs), without express written permission from us.
            </li>
            <li className={style.first}>
              To make our website available to you, you hereby grant us a royalty-free,
              non-exclusive, worldwide license to copy, display, use, broadcast, transmit and make
              derivative works of any content you publish, upload, or otherwise make available to
              our website. We claim no further proprietary rights in your Content.
            </li>
            <li className={style.heading}>SUBSCRIPTIONS AND PAYMENTS</li>
            <li className={style.first}>
              Our Services may require payment of subscription fees and/or other ad-hoc or ancillary
              fees before you can access or use them (“Fees”). These Fees will be notified to you
              through our website.
            </li>
            <li className={style.first}>
              If you purchase a recurring subscription from us, the subscription period for your
              Account shall be renewed automatically at the expiry of each subscription period,
              until terminated successfully through our website. By purchasing the recurring
              subscription, you authorise us or our related corporations to automatically charge the
              Fees:
            </li>
            <li className={style.second}>
              upon the commencement of your first subscription period, upon expiration of any
              applicable trial period or at a date otherwise indicated by us.
            </li>
            <li className={style.second}>
              on the renewal date of the subscription period thereafter, without any further action
              by you.
            </li>
            <li className={style.first}>
              Any Fees due in relation to your Account must be paid by their due date for payment,
              as notified to you through our website or otherwise. Failure to make timely payment of
              the Fees may result in the suspension or termination of your access to your Account
              and/or our website or any of the Services.
            </li>
            <li className={style.first}>
              Our Fees may be amended from time to time at our discretion. We will provide you
              reasonably advanced written notice of any amendment of recurring Fees. Your continued
              use of a recurring subscription will constitute acceptance of the amended Fees.
            </li>
            <li className={style.first}>
              You shall be responsible for any applicable taxes (including any goods and services
              tax) under these Terms.
            </li>
            <li className={style.first}>
              All payments shall be made by using the payment methods specified by us from time to
              time. You acknowledge and agree that you are subject to the applicable user agreement
              of any third-party payment methods. We shall not be liable for any failure,
              disruption, or error in connection with your chosen payment method. We reserve the
              right at any time to modify or discontinue, temporarily or permanently, any payment
              method without notice to you or giving any reason.
            </li>
            <li className={style.first}>
              We must receive payment in full no later than the day on which such payment is
              required to be paid in immediately available and freely transferable funds, without
              any restriction, condition, withholding, deduction, set-off or counterclaim
              whatsoever.
            </li>
            <li className={style.first}>
              Unless otherwise notified in writing by us, termination of your Account for any reason
              whatsoever shall not entitle you to any refund of the Fees.
            </li>
            <li className={style.first}>
              To the extent permitted by applicable law, payments are non-refundable. If you wish to
              cancel the Services, please contact us. We may at our sole and absolute discretion,
              offer a refund of Fees for a particular subscription period where no actions have been
              taken in respect of your Account and you have notified us in writing of your intention
              to terminate your subscription within 72 hours of you taking out your subscription.
            </li>
            <li className={style.heading}>USER OBLIGATIONS</li>
            <li className={style.first}>
              As a user of our website, you may be asked to supply Personal Data to us.
            </li>
            <li className={style.first}>
              You are responsible for ensuring the accuracy of this information. You must not share
              such Personal Data with any third party, and if you discover that your Personal Data
              has been compromised, you agree to notify us immediately in writing. An email
              notification will suffice. You are responsible for maintaining the safety and security
              of your Personal Data as well as keeping us apprised of any changes to your Personal
              Data. Providing false or inaccurate information or using our website to further fraud
              or unlawful activity is grounds for immediate termination of this Agreement.
            </li>
            <li className={style.first}>
              If you provide any material to our website (for example, by uploading content in any
              format (“Content”) you agree to grant us permission, irrevocably and free of charge,
              to use the User Content to provide you, our services.
            </li>
            <li className={style.first}>
              You own your User Content at all times, and you continue to have the right to use it
              in any way you choose.
            </li>
            <li className={style.first}>
              By providing any User Content to website you confirm that:
            </li>
            <li className={style.second}>
              you are authorised to provide it to us and that you have the right to give us
              permission to use it for the purposes set out in these Terms;
            </li>
            <li className={style.second}>
              it will not contain or promote anything illegal, harmful, or anything else that might
              cause widespread offence or bring us or our business partners into disrepute;
            </li>
            <li className={style.second}>
              it does not take away or affect any other person’s privacy rights, contract rights or
              any other rights;
            </li>
            <li className={style.second}>
              it does not contain any virus or other code that may damage, interfere with or
              otherwise adversely affect the operation of our website; and
            </li>
            <li className={style.second}>will not contain any form of mass-mailing or spam.</li>
            <li className={style.first}>
              If you do not want to grant us the permissions set out above, please do not provide
              any material to our website.
            </li>
            <li className={style.heading}>DATA PROTECTION</li>
            <li className={style.first}>
              We will collect and process information relating to the Service in accordance with our
              privacy policy and our auxiliary policies and under consideration of the FIPA and
              GDPR.
            </li>
            <li className={style.first}>
              We will entrust only such staff with the data processing who have been bound to
              confidentiality and have previously been familiarized with the data protection
              provisions relevant to their work.
            </li>
            <li className={style.first}>
              We and any person acting under our authority who has access to personal data may only
              process that data in accordance with your instructions unless otherwise required to do
              so by law and to provide our website or services.
            </li>
            <li className={style.first}>
              We agree to the implementation and observance of all technical and organizational
              measures necessary for this Agreement in accordance with the FIPA and GDPR.
            </li>
            <li className={style.first}>
              We will regularly monitor our internal processes as well as the Technical and
              organizational measures to ensure that the processing is executed in accordance with
              the requirements of the FIPA and GDPR and that the rights of you and our Service Users
              are protected.
            </li>
            <li className={style.heading}>ACCEPTABLE USE</li>
            <li className={style.first}>
              You agree not to use our website for any unlawful purpose, or any purpose prohibited
              under this clause. You agree not to use our website in any way that could damage our
              website, Services, or general business of Yehaww.
            </li>
            <li className={style.first}>You further agree not to use our website:</li>
            <li className={style.second}>
              To harass, abuse, or threaten others or otherwise violate any person's legal rights.
            </li>
            <li className={style.second}>
              To violate any of our intellectual property rights or any third party.
            </li>
            <li className={style.second}>
              To upload or otherwise disseminate any computer viruses or other software that may
              damage the property of another.
            </li>
            <li className={style.second}>To perpetrate any fraud.</li>
            <li className={style.second}>
              To publish or distribute any obscene or defamatory material.
            </li>
            <li className={style.second}>
              To publish or distribute any material that incites violence, hate, or discrimination
              towards any group.
            </li>
            <li className={style.second}>To unlawfully gather information about others.</li>
            <li className={style.heading}>JOB ADVERTISING RULES</li>
            <li className={style.first}>
              We have rules regarding the content and format of jobs posted on our website. The
              purpose is to ensure that users who search the website get results which are presented
              accurately.
            </li>
            <li className={style.first}>
              We may, at our sole discretion remove any advertisement which is posted.
            </li>
            <li className={style.first}>
              Job-seekers, Employers and Businesses need to be aware that Yehaww operates as a venue
              only and does not introduce or supply Job Seekers to Businesses nor conversely. Thus,
              we do not:
            </li>
            <li className={style.second}>
              obtain sufficient information for potential Businesses to select a suitable Job Seeker
              for the position which the Business seeks to fill;
            </li>
            <li className={style.second}>
              obtain confirmation of the identity of a Job Seeker or that they have the experience,
              training, qualifications or authorization to work in the position to be filled or that
              they wish to undertake the role to be filled;
            </li>
            <li className={style.second}>
              take any steps to ensure the Job Seeker and Business are each aware of any requirement
              imposed by law or otherwise which must be satisfied by either of them to permit the
              Job Seeker to fulfil the position to be filled;
            </li>
            <li className={style.second}>
              take any steps to ensure that it would not be detrimental to the interests of the Job
              Seeker or the Business for the Job Seeker to fulfil the position to be fulfilled;
            </li>
            <li className={style.second}>
              give any indication to Businesses whether Job Seekers are unsuitable (or suitable) for
              any position to be filled in any circumstances;
            </li>
            <li className={style.second}>
              propose Job Seekers to Businesses or provide any information about them.
            </li>
            <li className={style.second}>take up any references in relation to a Job Seeker; or</li>
            <li className={style.second}>
              make any arrangements for accommodation of Job Seekers.
            </li>
            <li className={style.first}>
              Therefore, we do not propose or introduce Job Seekers to Businesses or vice versa. It
              is recommended that, if you are a Job Seeker, you undertake steps as set out in the
              Regulations to ensure your suitability for the role advertised or, if you are a
              Business or employer, to ensure a Job Seekers' suitability for the role. Including but
              not limited to checking the identity of the Business/employer, risks to health and
              safety, experience, training, qualifications, and authorization.
            </li>
            <li className={style.first}>
              Advertisements which appear to discriminate on grounds of sex, race or disability are
              illegal and may result in proceedings being taken against both the advertiser and the
              publisher. Advertisements are accepted on the basis that the advertiser confirms that
              any requirement or qualification which may appear to discriminate illegally is in
              compliance with any exemption available under the relevant legislation.
            </li>
            <li className={style.first}>
              Notwithstanding this confirmation, if we nonetheless believe that an advertisement may
              be discriminatory, we may at our discretion either amend the advertisement or remove
              it without liability to you to make any refund of amounts paid or due to be paid in
              respect of the posting or otherwise and will inform you accordingly.
            </li>
            <li className={style.first}>
              Advertisements which appear to discriminate on grounds of sex, race or disability are
              illegal and may result in proceedings being taken against both the advertiser and the
              publisher. Advertisements are accepted on the basis that the advertiser confirms that
              any requirement or qualification which may appear to discriminate illegally is in
              compliance with any exemption available under the relevant legislation.
            </li>
            <li className={style.first}>
              Notwithstanding this confirmation, if we nonetheless believe that an advertisement may
              be discriminatory, we may at our discretion either amend the advertisement or remove
              it without liability to you to make any refund of amounts paid or due to be paid in
              respect of the posting or otherwise and will inform you accordingly.
            </li>
            <li className={style.first}>
              We do not guarantee any response to your advertisement or that responses will be from
              individuals suitable for the job advertised. It is your responsibility to carry out
              such checks and procedures as are necessary to ensure that candidates are suitable for
              the job advertised and have the required qualifications and personal characteristics.
            </li>
            <li className={style.heading}>ASSUMPTION OF RISK</li>
            <p className={style.p}>
              Our website is provided for communication purposes only. You acknowledge and agree
              that any information posted on our website is not intended to be legal advice, or
              financial advice, and no fiduciary relationship has been created between you and us.
              You further agree that your use of any of the services on our website is at your own
              risk. We do not assume responsibility or liability for any advice or other information
              given on our website.
            </p>
            <li className={style.heading}>NO PROMISES</li>
            <li className={style.first}>
              To the fullest extent permitted by applicable law, we hereby make no specific
              guarantee or warranty of any kind and exclude all promises, whether express or
              implied, including any promises that use of the Service will achieve any specific
              results, leads, new deals or agreements following the delivery of our work.
            </li>
            <li className={style.first}>
              You agree that your use of our website is at your sole and exclusive risk and that any
              Services provided by us are on an "As Is" basis. We hereby expressly disclaim any
              express or implied warranties of any kind, including, but not limited to the implied
              warranty of fitness for a particular purpose and the implied warranty of
              merchantability. We make no warranties that our website will meet your needs or that
              our website will be uninterrupted, error-free, or secure. We also make no warranties
              as to the reliability or accuracy of any information on our website or obtained
              through the Services. You agree that any damage that may occur to you, through your
              computer system, or because of the loss of your data from your use of our website is
              your sole responsibility and that we are not liable for any such damage or loss.
            </li>
            <li className={style.heading}>REVERSE ENGINEERING AND SECURITY</li>
            <li className={style.first}>
              You agree not to undertake any of the following actions:
            </li>
            <li className={style.second}>
              Reverse engineer or attempt to reverse engineer or disassemble any code or software
              from or on our website.
            </li>
            <li className={style.second}>
              Violate the security of our website through any unauthorized access, circumvention of
              encryption or other security tools, data mining, or interference to any host, user, or
              network.
            </li>
            <li className={style.heading}>INDEMNIFICATION</li>
            <p className={style.p}>
              You agree to defend and indemnify us and any of our affiliates (if applicable) and
              hold us harmless against any legal claims and demands, including reasonable attorney's
              fees, which may arise from or relate to your use or misuse of our website, your breach
              of this Agreement, or your conduct or actions. You agree that we shall be able to
              select its legal counsel and may participate in its defense if we wish.
            </p>
            <li className={style.heading}>EXCLUSION OF LIABILITY</li>
            <li className={style.first}>
              You understand and agree that we (A) do not guarantee the accuracy, completeness,
              validity, or timeliness of information listed by us or any third parties; and (B)
              shall not be responsible for any materials posted by us or any third party. You shall
              use your judgment, caution, and common sense in evaluating any prospective methods or
              offers and any information provided by us or any third party.
            </li>
            <li className={style.first}>
              Further, we shall not be liable for direct, indirect consequential, or any other form
              of loss or damage that may be suffered by a user using the Yehaww Website including
              loss of data or information or any kind of financial or physical loss or damage.
            </li>
            <li className={style.first}>
              In no event shall Yehaww, nor its Owner, directors, employees, partners, agents,
              suppliers, or affiliates, be accountable for any indirect, incidental, special,
              eventful, or exemplary costs, including without limitation, loss of proceeds, figures,
              usage, goodwill, or other intangible losses, consequential from (i) your use or access
              of or failure to access or use the Service; (ii) any conduct or content of any third
              party on the Service; (iii) any content attained from the Service; and (iv) unlawful
              access, use or alteration of your transmissions or content, whether or not based on
              guarantee, agreement, domestic wrong (including carelessness) or any other lawful
              concept, whether or not we've been aware of the possibility of such damage, and even
              if a cure set forth herein is originated to have futile of its important purpose.
            </li>
            <li className={style.heading}>SPAM POLICY</li>
            <p className={style.p}>
              You are strictly prohibited from using our website or any of our Services for illegal
              spam activities, including gathering email addresses and personal information from
              others or sending any mass commercial emails.
            </p>
            <li className={style.heading}>MODIFICATION AND VARIATION</li>
            <p className={style.p}>
              We may, from time to time and at any time without notice to you, modify this
              Agreement. You agree that we have the right to modify this Agreement or revise
              anything contained herein. You further agree that all modifications to this Agreement
              are in full force and effect immediately upon posting on our website and that
              modifications or variations will replace any prior version of this Agreement unless
              prior versions are specifically referred to or incorporated into the latest
              modification or variation of this Agreement.
            </p>
            <li className={style.heading}>TERM, TERMINATION AND SUSPENSION</li>
            <p className={style.p}>
              We may terminate this Agreement with you at any time for any reason, with or without
              cause. We specifically reserve the right to terminate this Agreement if you violate
              any of the terms outlined herein, including, but not limited to, violating the
              intellectual property rights of us or a third party, failing to comply with applicable
              laws or other legal obligations, and/or publishing or distributing illegal material.
              At the termination of this Agreement, any provisions that would be expected to survive
              termination by their nature shall remain in full force and effect.
            </p>
            <li className={style.heading}>GENERAL PROVISIONS</li>
            <li className={style.first}>
              This Agreement, or the rights granted hereunder, may not be assigned, sold, leased, or
              otherwise transferred in whole or part by you. Should this Agreement, or the rights
              granted hereunder, be assigned, sold, leased, or otherwise transferred by us, the
              rights, and liabilities of Yehaww will bind and inure to any assignees,
              administrators, successors, and executors.
            </li>
            <li className={style.first}>
              If any part or sub-part of this Agreement is held invalid or unenforceable by a court
              of law or competent arbitrator, the remaining parts and sub-parts will be enforced to
              the maximum extent possible. In such a condition, the remainder of this Agreement
              shall continue in full force.
            </li>
            <li className={style.first}>
              If we fail to enforce any provision of this Agreement, this shall not constitute a
              waiver of any future enforcement of that provision or any other provision. Waiver of
              any part or sub-part of this Agreement will not constitute a waiver of any other part
              or sub-part.
            </li>
            <li className={style.first}>
              Headings of parts and sub-parts under this Agreement are for convenience and
              organization, only. Headings shall not affect the meaning of any provisions of this
              Agreement.
            </li>
            <li className={style.first}>
              No agency, partnership, or joint venture has been created between the Parties because
              of this Agreement. No Party has any authority to bind the other to third parties.
            </li>
            <li className={style.first}>
              We are not liable for any failure to perform due to causes beyond its reasonable
              control including, but not limited to, acts of God, acts of civil authorities, acts of
              military authorities, riots, embargoes, acts of nature, and natural disasters, and
              other acts which may be due to unforeseen circumstances.
            </li>
            <li className={style.first}>
              These Terms, its subject matter and its formation, and any other disputes or claims in
              connection therewith, are governed by the law of the State of Florida. In the event of
              any such disputes or claims in connection with these Terms, you agree to first engage
              in good faith discussions with us to resolve such dispute or claim. If such dispute or
              claim is not resolved within sixty (60) days, we both irrevocably submit to the
              exclusive jurisdiction of the courts of Pompano Beach.
            </li>
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionSection;
