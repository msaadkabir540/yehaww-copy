import moment from "moment";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import List from "components/list";
import Loading from "components/loading";
import Container from "components/container";
import NotAppliedErrorMessage from "components/not-applied-error";

import { jobTypeKeys } from "utils/arrayHelper";
import { updateInterestedJob } from "api-services/employer";
import { getMyVideoInterviews } from "api-services/candidate";

import style from "./video.module.scss";

const MyVideoInterview = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    getMyVideoInterviews({ setInterviews, setLoading });
  }, []);

  return (
    <>
      {loading ? (
        <Loading pageLoader={true} />
      ) : (
        <>
          {!interviews?.length && (
            <NotAppliedErrorMessage
              paraText={" You have not applied for any positions, to get started"}
              clickText="click here"
              onClick={() => {
                router.push("/jobs");
              }}
            />
          )}
          {interviews?.length > 0 &&
            interviews?.every((interview) => !interview.interviewRequestDate) && (
              <NotAppliedErrorMessage
                paraText={"You have not received a video interview request, to apply more"}
                clickText="click here"
                onClick={() => {
                  router.push("/jobs");
                }}
              />
            )}

          <div>
            <div className={style.grid}>
              {interviews
                ?.filter((interview) => interview?.interviewRequestDate)
                ?.map(
                  (
                    {
                      jobId,
                      jobTitle,
                      expiresIn,
                      companyType,
                      coverLetter,
                      dateApplied,
                      companyImage,
                      interviewVideoUrl,
                      appliedCandidates,
                    },
                    index
                  ) => (
                    <div className={style.videoMain} key={index}>
                      <List
                        title={jobTitle}
                        id={jobId}
                        titleLink={`/jobs/details/${jobId}`}
                        badgeTitle1={coverLetter ? "Cover letter sent" : ""}
                        list_img={companyImage || `/assets/imgs/${jobTypeKeys[companyType]}.webp`}
                        listArr={[
                          `Applied ${moment(dateApplied).format("Do MMM YYYY")}`,
                          `Ends ${expiresIn > 1 ? `in ${expiresIn} days` : "Today"}`,
                        ]}
                        buttons={[
                          {
                            title: "View Job",
                            link: `/jobs/details/${jobId}`,
                          },
                          {
                            title: interviewVideoUrl ? "Review Video" : "Upload Video",
                            link: `/jobs/my-jobs?interview=true&jobId=${jobId}`,
                            btnClass: style.btnSecond,
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
                            await getMyVideoInterviews({ setInterviews });
                            setLoading(false);
                          },
                        }}
                        btnFlex={style.btn}
                        className={style.listWrapper}
                        tagClass={style.tag}
                      />
                    </div>
                  )
                )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyVideoInterview;
