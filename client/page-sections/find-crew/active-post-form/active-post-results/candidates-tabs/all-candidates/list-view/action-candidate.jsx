import Link from "next/link";
import { useState, useRef } from "react";

import ViewCandidateModal from "../../view-wite-candidate-modal";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./list.module.scss";

const ViewLetterCandidate = ({
  setViewLetter,
  handleShortlistCandidates,
  data: { candidateId, profileLinkId, jobId, userId, notes },
}) => {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setViewLetter(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <p
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className={style.borderClass}
        >
          Write Candidates Notes
        </p>
        <Link href={candidateId && jobId ? `/u/${profileLinkId}?jobId=${jobId}` : "#"}>
          <p
            onClick={(e) => {
              e.stopPropagation();
              setViewLetter(false);
            }}
            style={{ paddingBottom: "0px" }}
          >
            View Cover Letter
          </p>
        </Link>
      </div>
      <ViewCandidateModal
        open={open}
        setOpen={setOpen}
        data={{ jobId, userId, notes }}
        handleShortlistCandidates={handleShortlistCandidates}
      />
    </>
  );
};

export default ViewLetterCandidate;
