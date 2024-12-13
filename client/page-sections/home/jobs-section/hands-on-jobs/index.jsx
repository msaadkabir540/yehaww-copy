import moment from "moment";

import List from "components/list";

import { jobTypeKeys } from "utils/arrayHelper";

import style from "./shorebased.module.scss";

const HandsOnJobs = ({ dashboardData }) => {
  return (
    <div className={style.jobPosition}>
      {dashboardData?.fiveHandsOnJobs?.length > 0 &&
        dashboardData?.fiveHandsOnJobs?.map(
          ({ img, jobTitle, companyType, jobFilledStatus, jobId, list, createdAt }, index) => {
            const startDate = moment().format("DD-MM-YYYY");
            const difference = moment
              .duration(moment(startDate, "DD-MM-YYYY").startOf("day").diff(moment(createdAt)))
              .asDays();
            return (
              <div key={index} style={{ marginTop: "20px" }}>
                <List
                  id={jobId}
                  listArr={list}
                  title={jobTitle}
                  titleLink={`/jobs/details/${jobId}`}
                  badgeClass={jobFilledStatus && style.tag}
                  badgeTitle={jobFilledStatus ? "Position Filled" : difference < 3 ? "New" : ""}
                  list_img={img || `/assets/imgs/${jobTypeKeys[companyType]}.webp`}
                  buttons={[
                    {
                      title: "View Job",
                      link: `/jobs/details/${jobId}`,
                    },
                  ]}
                  className={style.card}
                />
              </div>
            );
          }
        )}
    </div>
  );
};

export default HandsOnJobs;
