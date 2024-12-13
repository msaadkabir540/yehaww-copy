import { useState, useRef } from "react";

import VideoInterviewRequestModal from "../video-interview-request-modal";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./list.module.scss";

const VideoRequestPopUp = ({ setVideoRequest, data, getCandidates }) => {
  const wrapperRef = useRef(null);

  const [videoModal, setVideoModal] = useState(false);

  useOutsideClickHook(wrapperRef, () => {
    setVideoRequest(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <p
          onClick={(e) => {
            e.stopPropagation();
            setVideoModal(true);
          }}
          style={{ paddingBottom: "0px" }}
        >
          Set/Request Video Iterview
        </p>
      </div>
      <VideoInterviewRequestModal
        data={data}
        open={videoModal}
        setOpen={setVideoModal}
        requestingInterview={true}
        setVideoRequest={setVideoRequest}
        getCandidates={getCandidates}
      />
    </>
  );
};

export default VideoRequestPopUp;
