import Link from "next/link";
import { useRef } from "react";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./candidate-popup.module.scss";

const CandidatePopUp = ({ setPopUpCandidate }) => {
  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setPopUpCandidate(false);
  });

  return (
    <>
      <div className={style.candidate_popup_mainInner} ref={wrapperRef}>
        <span className={style.head}>Find Candidates</span>
        <div
          onClick={() => {
            setPopUpCandidate(false);
          }}
        >
          <Link href="/candidate/search">
            <p>Search</p>
          </Link>
        </div>
        <div
          onClick={() => {
            setPopUpCandidate(false);
          }}
        >
          <Link href="/candidate/post-position">
            <p>Post a Position</p>
          </Link>
        </div>
        <div
          onClick={() => {
            setPopUpCandidate(false);
          }}
        >
          <Link href="/candidate/draft-post">
            <p>Draft Posts</p>
          </Link>
        </div>
        <div
          onClick={() => {
            setPopUpCandidate(false);
          }}
        >
          <Link href="/candidate/active-post">
            <p>Active Posts</p>
          </Link>
        </div>
        <div
          onClick={() => {
            setPopUpCandidate(false);
          }}
        >
          <Link href="/candidate/all-shortlisted">
            <p>All Shortlisted</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CandidatePopUp;
