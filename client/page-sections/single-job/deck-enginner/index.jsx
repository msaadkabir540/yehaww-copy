/* eslint-disable @next/next/no-img-element */
import moment from "moment/moment";
import { useRouter } from "next/router";

import Button from "components/button";

import { jobTypeKeys } from "utils/arrayHelper";

import style from "./deck.module.scss";
import Image from "next/image";

const DeckEngineerSection = ({ jobData }) => {
  const router = useRouter();

  return (
    <>
      <div className={style.mainSection}>
        <div className={style.img}>
          <Image
            width={200}
            height={197}
            className={style.img}
            src={
              jobData?.positionInfo?.image ||
              `/assets/imgs/${jobTypeKeys[jobData?.companyInfo?.companyType]}.webp`
            }
            alt="company-image"
          />
        </div>
        <div className={style.right}>
          <h4>{jobData?.jobTitle?.split("(")[0]?.trim()}</h4>

          <div>
            {jobData?.positionInfo?.startDate && (
              <p>
                <span>Start Date</span>
                <span style={{ width: "30px" }}>:</span>
                {moment(jobData?.positionInfo?.startDate).format("Do MMM YYYY")}{" "}
              </p>
            )}

            <p>
              <span>Job ID </span>
              <span style={{ width: "30px" }}>:</span># {jobData?.jobId}
            </p>
            <p>
              <span>Budget </span>
              <span style={{ width: "30px" }}>:</span>{" "}
              {jobData?.positionInfo?.salary
                ? `${jobData?.positionInfo?.currency} ${jobData?.positionInfo?.salary}`
                : "Salary: To Be Determined"}
            </p>

            <p>
              <span>Posted by</span>
              <span style={{ width: "30px" }}>:</span>
              {jobData?.companyInfo?.companyName ? jobData?.companyInfo?.companyName : "Anonymous"}
            </p>
          </div>
          <div className={style.btnDiv}>
            <Button
              title={`View all ${jobData?.companyInfo?.companyName} jobs`}
              handleClick={() => {
                router.push({
                  pathname: "/jobs",
                  ...(jobData?.companyInfo?.companyName && {
                    query: {
                      companyName: jobData?.companyInfo?.companyName,
                    },
                  }),
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DeckEngineerSection;
