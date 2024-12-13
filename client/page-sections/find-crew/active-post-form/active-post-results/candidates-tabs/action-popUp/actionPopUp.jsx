import { useState, useRef } from "react";
import Link from "next/link";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./action-popUp.module.scss";

const ActionPopUp = ({
  index,
  candidate,
  setVideoModal,
  setOpenAction,
  setFullVideoModal,
  setCandidateNotesModal,
  handleShortlistCandidates,
  data: { profileLinkId, jobId, coverLetter, interviewVideoUrl },
}) => {
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setOpenAction(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <p
          onClick={(e) => {
            e.stopPropagation();
            setCandidateNotesModal(true);
          }}
          className={style.borderClass}
        >
          Write Candidates Notes
        </p>
        {coverLetter && (
          <Link
            href={
              profileLinkId && jobId
                ? `/u/${profileLinkId}?jobId=${jobId}`
                : profileLinkId
                ? `/u/${profileLinkId}`
                : "#"
            }
          >
            <p
              onClick={(e) => {
                e.stopPropagation();
                setOpenAction(false);
              }}
              className={style.borderClass}
            >
              View Cover Letter
            </p>
          </Link>
        )}
        {interviewVideoUrl && (
          <p
            onClick={(e) => {
              e.stopPropagation();
              setFullVideoModal(index);
            }}
            className={style.borderClass}
          >
            Watch Video Interview
          </p>
        )}
        <p
          onClick={async (e) => {
            e.stopPropagation();
            setLoading("shortlist");
            await handleShortlistCandidates({
              interestedStatus: candidate.shortlisted ? "none" : "true",
              jobId: candidate.jobId,
              userId: candidate.userId,
            });
            setLoading(false);
          }}
          className={style.borderClass}
        >
          {loading === "shortlist" ? "loading" : "Short list"}
        </p>
        <p
          onClick={async (e) => {
            e.stopPropagation();
            setLoading("notInterested");
            handleShortlistCandidates({
              interestedStatus: candidate.notInterested ? "none" : "false",
              jobId: candidate.jobId,
              userId: candidate.userId,
            });
            setLoading(false);
          }}
          className={style.borderClass}
        >
          {loading === "notInterested" ? "loading" : "Not Interested"}
        </p>
        <p
          onClick={(e) => {
            e.stopPropagation();
            setVideoModal(index);
          }}
        >
          Review Video Interview Questions
        </p>
      </div>
    </>
  );
};

export default ActionPopUp;
