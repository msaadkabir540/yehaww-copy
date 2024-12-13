import { useState } from "react";
import { useRef } from "react";

import WatchVideoModal from "../watch-video-modal";
import VideoInterviewRequestModal from "../video-interview-request-modal";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./list.module.scss";

const WatchVideoPopUp = ({ setWatchVideo, data, interviewVideoUrl }) => {
  const wrapperRef = useRef(null);

  const [videoModal, setVideoModal] = useState(false);
  const [fullVideoModal, setFullVideoModal] = useState(false);

  useOutsideClickHook(wrapperRef, () => {
    setWatchVideo(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        {interviewVideoUrl && (
          <p
            onClick={(e) => {
              e.stopPropagation();
              setFullVideoModal(true);
            }}
            className={style.borderClass}
          >
            Watch Video Interview
          </p>
        )}
        <p
          onClick={(e) => {
            e.stopPropagation();
            setVideoModal(true);
          }}
          style={{ paddingBottom: "0px" }}
        >
          Review Video Interview Questions
        </p>
      </div>
      <WatchVideoModal
        fullVideoModal={fullVideoModal}
        setFullVideoModal={setFullVideoModal}
        interviewVideoUrl={interviewVideoUrl}
      />
      <VideoInterviewRequestModal open={videoModal} setOpen={setVideoModal} data={data} />
    </>
  );
};

export default WatchVideoPopUp;
