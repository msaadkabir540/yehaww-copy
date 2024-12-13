import moment from "moment";

import List from "components/list";

import { jobTypeKeys } from "utils/arrayHelper";

import style from "./agency.module.scss";

const StayCleanJobs = ({ dashboardData }) => {
  return (
    <div className={style.jobPosition}>
      {dashboardData?.fiveStayCleanJobs?.length > 0 &&
        dashboardData?.fiveStayCleanJobs?.map(
          ({ img, jobTitle, jobId, jobFilledStatus, companyType, list, createdAt }, index) => {
            const startDate = moment().format("DD-MM-YYYY");
            const difference = moment
              .duration(moment(startDate, "DD-MM-YYYY").startOf("day").diff(moment(createdAt)))
              .asDays();
            return (
              <div key={index} style={{ marginTop: "20px" }}>
                <List
                  id={jobId}
                  list_img={img || `/assets/imgs/${jobTypeKeys[companyType]}.webp`}
                  listArr={list}
                  title={jobTitle}
                  titleLink={`/jobs/details/${jobId}`}
                  badgeClass={jobFilledStatus && style.tag}
                  badgeTitle={jobFilledStatus ? "Position Filled" : difference < 3 ? "New" : ""}
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

export default StayCleanJobs;
