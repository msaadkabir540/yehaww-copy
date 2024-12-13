import moment from "moment";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import List from "components/list";
import HowItsWork from "./how-its-work";
import Loading from "components/loading";
import CompleteInterview from "./complete-interview";
import NotAppliedErrorMessage from "components/not-applied-error";

import { getMyJobs, updateInterestedJob } from "api-services/employer";

import style from "./job-tab.module.scss";
import { jobTypeKeys } from "utils/arrayHelper";

const MyJobsTab = () => {
  const router = useRouter();

  const [jobs, setJobs] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    !router?.query?.interview ? getMyJobs({ setJobs, setLoading }) : setLoading(false);
  }, [router]);

  return (
    <>
      {loading ? (
        <Loading pageLoader={true} />
      ) : (
        <>
          {!router?.query?.interview && !jobs?.length && (
            <NotAppliedErrorMessage
              paraText={" You have not applied for any positions,to get started"}
              clickText="click here"
              onClick={() => {
                router.push("/jobs");
              }}
            />
          )}
          <div>
            {router?.query?.interview ? (
              <CompleteInterview />
            ) : (
              <div className={style.grid}>
                {jobs?.map?.(
                  (
                    {
                      jobId,
                      jobTitle,
                      expiresIn,
                      dateApplied,
                      companyType,
                      companyImage,
                      appliedCandidates,
                    },
                    index
                  ) => (
                    <div className={style.videoMain} key={index}>
                      <List
                        list_img={companyImage || `/assets/imgs/${jobTypeKeys[companyType]}.webp`}
                        title={jobTitle}
                        id={jobId}
                        titleLink={`/jobs/details/${jobId}`}
                        listArr={[
                          `Applied on ${moment(dateApplied).format("Do MMM YYYY")}`,
                          `Ends ${expiresIn > 1 ? `in ${expiresIn} days` : "Today"}`,
                        ]}
                        buttons={[
                          {
                            title: "View Job",
                            link: `/jobs/details/${jobId}`,
                          },
                        ]}
                        // applicationTitle="Application Submitted."
                        // text={`Your Profile has matched with this job opportunity.There are currently ${appliedCandidates} applicants for this position`}
                        removeBtn={{
                          title: "Remove Application",
                          handleClick: async () => {
                            setLoading(true);
                            await updateInterestedJob({
                              body: { jobId, interested: false },
                            });
                            await getMyJobs({ setJobs });
                            setLoading(false);
                          },
                        }}
                        className={style.listWrapper}
                        btnFlex={style.btn}
                        tagClass={style.tag}
                      />
                    </div>
                  )
                )}
              </div>
            )}
            {!router?.query?.interview && <HowItsWork />}
          </div>
        </>
      )}
    </>
  );
};

export default MyJobsTab;
