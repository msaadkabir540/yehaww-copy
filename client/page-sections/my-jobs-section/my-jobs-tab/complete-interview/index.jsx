import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Loading from "components/loading";
import InterviewQuestions from "./interview-questions";
import VideoPlayer from "page-sections/videos/video-player";
import UploadVideoInterview from "./upload-video-interview";

import { getInterviewData } from "api-services/candidate";

import style from "./complete.module.scss";

const CompleteInterview = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState({});

  const getInterviewHandler = async () => {
    router?.query?.jobId &&
      (await getInterviewData({ jobId: router?.query?.jobId, setLoading, setInterview }));
  };

  useEffect(() => {
    getInterviewHandler();
  }, [router]);

  return (
    <>
      {loading ? (
        <Loading pageLoader={true} />
      ) : (
        <div className={style.main}>
          <div className={style.mainFlex}>
            <h1>
              {`${interview?.interviewVideoUrl ? "Completed" : "Upload"} Interview for ${
                interview.jobTitle
              }`}
            </h1>
            <p>Ends in ${interview?.expiresIn} days</p>
          </div>
          <div className={style.gridSection}>
            <div className={style.left}>
              <InterviewQuestions questions={interview?.interviewQuestions} />
            </div>
            {interview?.interviewVideoUrl && (
              <div className={style.right}>
                <VideoPlayer src={interview?.interviewVideoUrl} className={style.video} />
              </div>
            )}
          </div>
          {!interview?.interviewVideoUrl && (
            <UploadVideoInterview getInterviewHandler={getInterviewHandler} />
          )}
        </div>
      )}
    </>
  );
};

export default CompleteInterview;
