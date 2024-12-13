import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Card from "components/card";
import Button from "components/button";
import WatchVideoModal from "../watch-video-modal";
import ActionPopUp from "../../action-popUp/actionPopUp";
import ViewCandidateModal from "../../view-wite-candidate-modal";
import VideoInterviewRequestModal from "../video-interview-request-modal";

// import profileImg from "public/assets/imgs/6.webp";
import style from "./grid-view.module.scss";

const AllCandidatesGrid = ({ token, candidates, getCandidates, handleShortlistCandidates }) => {
  const router = useRouter();

  const [openAction, setOpenAction] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [videoRequest, setVideoRequest] = useState(false);
  const [fullVideoModal, setFullVideoModal] = useState(false);
  const [candidateNotesModal, setCandidateNotesModal] = useState(false);

  return (
    <div className={style.grid}>
      {candidates?.candidates?.map((ele, index) => (
        <div style={{ position: "relative" }} key={index}>
          <Card className={style.card_wrapper}>
            <Link
              href={`/u/${ele?.profileLinkId}?jobId=${ele?.jobId}`}
              className={style.avatar_link}
            >
              <div className={style.avatar_img}>
                <Image
                  height={195}
                  width="200%"
                  // layout="fill"
                  src={ele.mainPhoto ? ele.mainPhoto : "assets/imgs/6.webp"}
                  alt="profile img"
                  className={style.profile_img}
                />
              </div>
            </Link>
            <div className={style.name_wrapper}>
              <Link href={`/u/${ele?.profileLinkId}?jobId=${ele?.jobId}`}>
                {ele.firstName + " " + ele.lastName}
              </Link>
              {!token && (
                <div className={style.locked}>
                  <p>Locked</p>
                </div>
              )}
            </div>
            <ul className={style.detail_wrapper}>
              <li>
                <span className={style.key}>Availability</span>
                <span className={style.value}>{ele.availability}</span>
              </li>
              <li>
                <span className={style.key}>Location</span>
                <span className={style.value}>{ele.location}</span>
              </li>
            </ul>
            <div className={style.btn_wrapper}>
              <Button
                title={ele.coverLetter ? "View Profile + Cover Letter" : "View Profile"}
                className={style.btn}
                handleClick={(e) => {
                  e.stopPropagation();
                  router.push(`/u/${ele?.profileLinkId}?jobId=${ele?.jobId}`);
                }}
              />

              <Button
                title={"Actions"}
                className={`${style.signUp} ${style.btn}`}
                handleClick={() => {
                  setOpenAction(index);
                }}
              />
            </div>
          </Card>
          {openAction === index && (
            <div
              style={{
                zIndex: 2600,
                width: "100%",
                padding: "0px 10px",
                position: "absolute",
                transition: "all 1.5s",
              }}
            >
              <ActionPopUp
                candidate={ele}
                index={index}
                setOpenAction={setOpenAction}
                setVideoModal={setVideoModal}
                setFullVideoModal={setFullVideoModal}
                setCandidateNotesModal={setCandidateNotesModal}
                handleShortlistCandidates={handleShortlistCandidates}
                data={{
                  notes: ele?.notes,
                  jobId: ele?.jobId,
                  video: ele.uploads,
                  userId: ele?.userId,
                  candidateId: ele?.candidateId,
                  coverLetter: ele?.coverLetter,
                  profileLinkId: ele?.profileLinkId,
                  interviewVideoUrl: ele?.interviewVideoUrl,
                }}
              />
              {fullVideoModal === index && (
                <WatchVideoModal
                  setFullVideoModal={setFullVideoModal}
                  fullVideoModal={fullVideoModal === index}
                  interviewVideoUrl={ele?.interviewVideoUrl}
                />
              )}
              <VideoInterviewRequestModal
                setOpen={setVideoModal}
                requestingInterview={true}
                open={videoModal === index}
                getCandidates={getCandidates}
                setVideoRequest={setVideoRequest}
                data={{ jobId: ele?.jobId, userId: ele?.userId }}
              />
              <ViewCandidateModal
                open={candidateNotesModal}
                setOpen={setCandidateNotesModal}
                handleShortlistCandidates={handleShortlistCandidates}
                data={{ jobId: ele?.jobId, userId: ele?.userId, notes: ele?.notes }}
              />
            </div>
          )}
        </div>
      ))}
      <br />
      <br></br>
    </div>
  );
};

export default AllCandidatesGrid;
