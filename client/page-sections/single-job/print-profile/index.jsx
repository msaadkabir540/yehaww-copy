import moment from "moment";
import Image from "next/image";

import Container from "components/container";
import GoogleMapsMarker from "components/map-markers";

import { jobTypeKeys } from "utils/arrayHelper";

import style from "./print-profile.module.scss";

const PrintMyProfile = ({ jobData }) => {
  return (
    <Container className={style.container} jobData={jobData}>
      <div className={style.main}>
        <div className={style.date}>
          <p>{moment().format("MM/DD/YY, hh:mm A")}</p>
          <p className={style.p2}>
            {jobData?.jobTitle} wanted for{" "}
            {jobData?.companyInfo?.companyName ? jobData?.companyInfo?.companyName : "Anonymous"} |
            Yehaww
          </p>
          <p></p>
        </div>
        <div className={style.bottomSec}>
          <h3>Details</h3>
          <div style={{ width: "100%", padding: "10px" }}>
            <div className={style.img5}>
              <Image
                src={
                  jobData?.positionInfo?.image ||
                  `/assets/imgs/${jobTypeKeys[jobData?.companyInfo?.companyType]}.webp`
                }
                alt="no"
                height={180}
                width={180}
                className={style.img5}
              />
            </div>
          </div>
          <h3>{jobData?.jobTitle}</h3>
          <div className={style.wrap}>
            <p>
              {jobData?.positionInfo?.salary
                ? `${jobData?.positionInfo?.currency} ${jobData?.positionInfo?.salary}`
                : "Salary: To Be Determined"}
            </p>
            <p>Start Date: {moment(jobData?.startDate).format("Do MMM YYYY")}</p>
            <p>Job ID # {jobData?.jobId}</p>
            <p>
              Posted by:{" "}
              {jobData?.companyInfo?.companyName ? jobData?.companyInfo?.companyName : "Anonymous"}
            </p>
          </div>
          <div className={style.sec2}>
            <p>
              {jobData?.jobTitle} Needed For A {jobData?.companyInfo?.numOfHorses}+ Horses{" "}
              {jobData?.companyInfo?.levelOfOperation}
            </p>
            <p>Start Date: {moment(jobData?.startDate).format("Do MMM YYYY")}</p>
            <div className={style.flex1}>
              <h4>About the position:</h4>
              <p>{jobData?.positionInfo?.aboutThePosition}</p>
            </div>
            <div className={style.flex1}>
              <h4>{jobData?.positionInfo?.aboutThePositionOtherLanguage} Description:</h4>
              <p>{jobData?.positionInfo?.aboutThePositionOtherLanguageText}</p>
            </div>
            <p>Employee Expectations: {jobData?.positionInfo?.employeeExpectations}</p>
            <p>Further details will be provided at the interview stage.</p>
          </div>
          <br />
          <div className={style.lists}>
            <p>REQUIREMENTS FOR APPLICATION:</p>

            <ul>
              <li>Previous Experience: {jobData?.preferredCandidate?.professionalExperience}</li>
              <li>Strong service skills are needed</li>
              <li>Fully vaccinated</li>
              <li>Availability: {jobData?.preferredCandidate?.availability}</li>
              <li>
                Nationality preffered:
                <ul>
                  {jobData?.preferredCandidate?.nationality.map((type, index) => (
                    <div className={style.bgColor} key={index}>
                      <div className={style.flex}>
                        <li key={index}>{type}</li>
                      </div>
                    </div>
                  ))}
                </ul>
              </li>
              <li>
                Visa(s) needed:
                <ul>
                  {jobData?.preferredCandidate?.visa?.visaType.map((type, index) => (
                    <div className={style.bgColor} key={index}>
                      <div className={style.flex}>
                        <li key={index}> {type}</li>
                      </div>
                    </div>
                  ))}
                </ul>
              </li>
              <li>
                Language(s):
                <ul>
                  {jobData?.preferredCandidate?.languages.map((type, index) => (
                    <div className={style.bgColor} key={index}>
                      <div className={style.flex}>
                        <li key={index}> {type.name}</li>
                      </div>
                    </div>
                  ))}
                </ul>
              </li>
              <li>
                PACKAGE:
                <ul>
                  <li>
                    Salary:{" "}
                    {jobData?.positionInfo?.salary
                      ? jobData?.positionInfo?.salary
                      : "To Be Determined"}
                  </li>
                </ul>
              </li>
              <li>Excellent references are needed</li>
            </ul>
          </div>
          {jobData?.position && (
            <div style={{ marginTop: "20px" }}>
              <GoogleMapsMarker
                markers={[
                  {
                    id: jobData?._id,
                    img: jobData?.positionInfo?.image,
                    jobId: jobData?.positionInfo?.jobId,
                    salary: jobData?.positionInfo?.salary,
                    currency: jobData?.positionInfo?.currency,
                    jobTitle: jobData?.jobTitle,
                    position: jobData?.position,
                    companyType: jobData?.companyInfo?.companyType,
                    companyName: jobData?.companyInfo?.companyName,
                    employmentType: jobData?.employmentType,
                    currentlyLocated: jobData.positionInfo?.currentlyLocated,
                  },
                ]}
                styles={{ width: "100%", height: "400px" }}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PrintMyProfile;
