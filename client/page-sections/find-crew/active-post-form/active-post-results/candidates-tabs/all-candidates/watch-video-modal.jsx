import Modal from "components/modal";
import VideoPlayer from "page-sections/videos/video-player";

import style from "./all-candidates.module.scss";

const WatchVideoModal = ({ fullVideoModal, interviewVideoUrl, setFullVideoModal }) => {
  return (
    <div>
      <Modal
        open={fullVideoModal}
        handleClose={() => {
          setFullVideoModal && setFullVideoModal(false);
        }}
      >
        <VideoPlayer src={interviewVideoUrl} className={style.video} />
      </Modal>
    </div>
  );
};

export default WatchVideoModal;
