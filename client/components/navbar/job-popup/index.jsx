import Link from "next/link";
import { useRef } from "react";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./job-popup.module.scss";

const JobPopUp = ({ setPopUpJob }) => {
  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setPopUpJob(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <span className={style.head}>Jobs</span>
        <Link href="/jobs">
          <p onClick={() => setPopUpJob(false)}>Search</p>
        </Link>
        <Link href="/jobs/my-jobs">
          <p onClick={() => setPopUpJob(false)}>My Jobs</p>
        </Link>
        <Link href="/profile-overview/profile">
          <p onClick={() => setPopUpJob(false)}>My Profile</p>
        </Link>
        <Link href="/jobs/video-interviews">
          <p onClick={() => setPopUpJob(false)}>My Video Interviews</p>
        </Link>
      </div>
    </>
  );
};

export default JobPopUp;
