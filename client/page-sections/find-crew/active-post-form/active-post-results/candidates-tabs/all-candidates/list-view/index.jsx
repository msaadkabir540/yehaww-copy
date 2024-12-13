import { useState } from "react";
import { useRouter } from "next/router";
import {
  faCheck,
  faCopy,
  faDownload,
  faEllipsis,
  faLock,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import MenuPopUp from "./menu-popup";
import Button from "components/button";
import Loading from "components/loading";
import DownloadPopUp from "./download-popup";
import WatchVideoPopUp from "./watch-video-popup";
import ViewLetterCandidate from "./action-candidate";
import VideoRequestPopUp from "./video-request-interview";

import style from "./list.module.scss";
import Image from "next/image";

const CandidatesListView = ({ token, candidates, getCandidates, handleShortlistCandidates }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [menuPopUp, setMenuPopUp] = useState(false);
  const [viewLetter, setViewLetter] = useState(false);
  const [watchVideo, setWatchVideo] = useState(false);
  const [videoRequest, setVideoRequest] = useState(false);
  const [downloadPopUp, setDownloadPopUp] = useState(false);

  return (
    <>
      <div className={style.mainTable}>
        <div className={style.innerTab}>
          {candidates?.candidates?.length > 0 && (
            <div className={style.header}>
              <p style={{ width: "300px", textAlign: "left" }}>All Candidates</p>
              <p>Availability</p>
              <p>Location</p>
              <p>Shortlisted</p>
              <p style={{ width: "300px" }}>Actions</p>
              <p></p>
            </div>
          )}
          {candidates?.candidates?.map(
            (
              {
                jobId,
                notes,
                userId,
                cvLink,
                lastName,
                location,
                mainPhoto,
                firstName,
                references,
                phoneNumber,
                coverLetter,
                shortlisted,
                candidateId,
                availability,
                profileLinkId,
                notInterested,
                interviewVideoUrl,
                videoInterviewRequest,
                certificates: { certifications },
              },
              index
            ) => (
              <div
                className={style.rows}
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className={style.flex}
                  onClick={() => {
                    router.push(`/u/${profileLinkId}?jobId=${jobId}`);
                  }}
                >
                  <div className={style.img}>
                    <Image
                      width={82}
                      height={72}
                      src={mainPhoto ? mainPhoto : "/assets/imgs/6.webp"}
                      alt="profile_photo"
                    />
                  </div>
                  <div className={style.flex1}>
                    <p style={{ marginLeft: "5px" }}>{firstName + " " + lastName}</p>
                    {!token && (
                      <FontAwesomeIcon
                        className={style.icon}
                        icon={faLock}
                        width={15}
                        height={15}
                      />
                    )}
                  </div>
                </div>
                <p>{availability}</p>
                <p>{location}</p>
                <div className={style.flex} style={{ justifyContent: "center", width: "150px" }}>
                  <div
                    title="Shortlisted"
                    className={`${style.iconDiv} ${shortlisted ? style.check : ""}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setLoading({ name: "shortlist", index });
                      await handleShortlistCandidates({
                        interestedStatus: shortlisted ? "none" : "true",
                        jobId,
                        userId,
                      });
                      setLoading(false);
                    }}
                  >
                    {loading?.name === "shortlist" && loading?.index === index ? (
                      <Loading />
                    ) : (
                      <FontAwesomeIcon
                        className={style.icon2}
                        icon={faCheck}
                        width={15}
                        height={15}
                      />
                    )}
                  </div>
                  <div
                    title="Not Shortlisted"
                    className={`${style.iconDiv} ${notInterested ? style.unCheck : ""}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setLoading({ name: "notInterested", index });
                      await handleShortlistCandidates({
                        interestedStatus: notInterested ? "none" : "false",
                        jobId,
                        userId,
                      });
                      setLoading(false);
                    }}
                  >
                    {loading?.name === "notInterested" && loading?.index === index ? (
                      <Loading />
                    ) : (
                      <FontAwesomeIcon
                        className={`${style.icon2}`}
                        icon={faXmark}
                        width={15}
                        height={15}
                      />
                    )}
                  </div>
                </div>
                <div className={style.actionsDiv}>
                  <div
                    title="Notes"
                    className={`${style.iconDiv1}
              ${viewLetter === index ? style.halfFill : ""}
              `}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewLetter(index);
                    }}
                  >
                    <FontAwesomeIcon className={style.icon2} icon={faCopy} width={15} height={15} />
                  </div>
                  <div
                    title="Video Interview"
                    className={`${style.iconDiv1} ${
                      watchVideo === index
                        ? style.fillBlue
                        : videoRequest === index
                        ? style.halfFill
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      videoInterviewRequest ? setWatchVideo(index) : setVideoRequest(index);
                    }}
                  >
                    <FontAwesomeIcon
                      className={`${style.icon2} ${
                        videoInterviewRequest && style.interviewRequested
                      }
                       ${interviewVideoUrl && style.interviewUploaded}
                      `}
                      icon={faVideo}
                      width={15}
                      height={15}
                    />
                  </div>
                  <div
                    title="Download"
                    className={`${style.iconDiv1} ${downloadPopUp === index ? style.halfFill : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDownloadPopUp(index);
                    }}
                  >
                    <FontAwesomeIcon
                      className={style.icon2}
                      icon={faDownload}
                      width={15}
                      height={15}
                    />
                  </div>
                  <div
                    title="More Options"
                    className={`${style.iconDiv1}
              ${menuPopUp === index ? style.halfFill : ""}
              
              `}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuPopUp(index);
                    }}
                  >
                    <FontAwesomeIcon
                      className={style.icon2}
                      icon={faEllipsis}
                      width={15}
                      height={15}
                    />
                  </div>
                  {viewLetter === index && (
                    <div
                      style={{
                        position: "absolute",
                        transition: "all 1.5s",
                        zIndex: 2600,
                        width: "300px",
                        top: "100%",
                        right: "145px",
                        padding: "0px 10px",
                      }}
                    >
                      <ViewLetterCandidate
                        setViewLetter={setViewLetter}
                        data={{ userId, candidateId, profileLinkId, jobId, notes }}
                        handleShortlistCandidates={handleShortlistCandidates}
                      />
                    </div>
                  )}
                  {watchVideo === index && (
                    <div
                      style={{
                        position: "absolute",
                        transition: "all 1.5s",
                        zIndex: 2600,
                        width: "300px",
                        top: "100%",
                        right: "95px",
                        padding: "0px 10px",
                      }}
                    >
                      <WatchVideoPopUp
                        data={{ jobId, userId }}
                        setWatchVideo={setWatchVideo}
                        interviewVideoUrl={interviewVideoUrl}
                      />
                    </div>
                  )}
                  {videoRequest === index && (
                    <div
                      style={{
                        position: "absolute",
                        transition: "all 1.5s",
                        zIndex: 2600,
                        width: "300px",
                        top: "100%",
                        right: "95px",
                        padding: "0px 10px",
                      }}
                    >
                      <VideoRequestPopUp
                        data={{ jobId, userId }}
                        getCandidates={getCandidates}
                        setVideoRequest={setVideoRequest}
                      />
                    </div>
                  )}
                  {downloadPopUp === index && (
                    <div
                      style={{
                        position: "absolute",
                        transition: "all 1.5s",
                        zIndex: 2600,
                        width: "300px",
                        top: "120px",
                        padding: "0px 10px",
                        top: "100%",
                        right: "40px",
                      }}
                    >
                      {(certifications?.[0]?.url || references?.[0]?.url || cvLink) && (
                        <DownloadPopUp
                          downloadPopUp={downloadPopUp}
                          setDownloadPopUp={setDownloadPopUp}
                          data={{ cvLink, references, certifications }}
                        />
                      )}
                    </div>
                  )}
                  {menuPopUp === index && (
                    <div
                      style={{
                        position: "absolute",
                        transition: "all 1.5s",
                        zIndex: 2600,
                        width: "300px",
                        top: "100%",
                        right: "0px",
                        padding: "0px 10px",
                      }}
                    >
                      <MenuPopUp
                        setMenuPopUp={setMenuPopUp}
                        data={{ name: `${firstName} ${lastName}`, phoneNumber }}
                        menuPopUp={menuPopUp}
                      />
                    </div>
                  )}
                </div>
                <div style={{ width: "150px" }}>
                  <Button
                    title={coverLetter ? "View Profile + Cover Letter" : "View Profile"}
                    className={style.btn}
                    handleClick={(e) => {
                      e.stopPropagation();
                      router.push(`/u/${profileLinkId}?jobId=${jobId}`);
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default CandidatesListView;
