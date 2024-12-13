/* eslint-disable @next/next/no-img-element */
import BorderForm from "components/border-form";
import Container from "components/container";
import Rating from "components/rating";

import style from "./rank.module.scss";

const RankSection = ({
  control,
  referenceData: { candidateName, companyName, refName, url, verified },
}) => {
  return (
    <>
      <div>
        <div className={style.card}>
          <h1 className={style.h1}>
            {verified ? "Reference Name: " : "Dear"} {refName}
          </h1>
          {!verified && (
            <p className={style.p1}>
              Thank You For Taking Time To Confirm {candidateName} Reference{" "}
              <b>This Information is made publicly available To The Candidate.</b>
              If You Don Not Wish To leave A reference Simply Click 'Decline' Below
            </p>
          )}
          <div className={style.flex}>
            <p className={style.p2}>
              <b> Name Of Company:</b>
              <span> {companyName}</span>
            </p>
            <p className={style.p2}>
              <b>Reference Uploaded:</b>{" "}
              {url ? (
                <a href={url} target="_blank">
                  <span>Reference File</span>
                </a>
              ) : (
                "Not Uploaded"
              )}
            </p>
          </div>
        </div>
        <BorderForm
          title={verified ? "Candidate Ranking:" : "Please Rank This Candidate Performance: "}
        >
          <div className={style.grid}>
            {data.map(({ name, title }, index) => (
              <BorderForm key={index} title={title} className={style.borderForm}>
                <Rating control={control} name={name} />
              </BorderForm>
            ))}
          </div>
        </BorderForm>
      </div>
    </>
  );
};

export default RankSection;

const data = [
  {
    title: "Re-Employ",
    name: "reEmploy",
  },
  {
    title: "Cleanliness",
    name: "cleanliness",
  },
  {
    title: "Horsemanship",
    name: "horsemanship",
  },
  {
    title: "Professionalism",
    name: "professionalism",
  },
  {
    title: "Thoroughness",
    name: "thoroughness",
  },
  {
    title: "Punctuality",
    name: "punctuality",
  },
  {
    title: "Communication",
    name: "communication",
  },
  {
    title: "Team Player",
    name: "teamPlayer",
  },
  {
    title: "Work Ethic ",
    name: "workEthic",
  },
];
