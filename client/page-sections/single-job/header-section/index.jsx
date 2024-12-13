/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";

import Container from "components/container";
import ForwardPopUp from "./forward-popup";

import arrow from "public/assets/icons/arrow.svg";
import exclamationIcon from "public/assets/icons/exclamation.svg";

import style from "./header.module.scss";
import { useSelector } from "react-redux";
import ReportModal from "./report-modal";

const HeaderSection = ({ onPrint, jobData }) => {
  const [shareLink, setShareLink] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const { user } = useSelector((state) => state?.app);

  return (
    <>
      <div className={style.headingDiv}>
        <Container className={style.container}>
          <h1>
            <Link href="/jobs">
              <span>Job </span>
            </Link>
            <div className={style.arrow_icon}>
              <Image
                src={arrow}
                height={12}
                width={13}
                alt={"arrow icon"}
                className={style.arrow_icon}
              />
            </div>
            <Link href={`/jobs/${jobData?.jobCategory}`}>
              <span>{jobData?.jobCategory}</span>
            </Link>
            <div className={style.arrow_icon}>
              <Image
                src={arrow}
                height={12}
                width={13}
                alt={"arrow icon"}
                className={style.arrow_icon}
              />
            </div>
            <Link href={`/jobs/${jobData?.jobCategory}/${jobData?.jobTitle?.replace("/", "-")}`}>
              <span>{jobData?.jobTitle?.split("(")[0]?.trim()}</span>
            </Link>
            <div className={style.arrow_icon}>
              <Image
                src={arrow}
                height={12}
                width={13}
                alt={"arrow icon"}
                className={style.arrow_icon}
              />
            </div>
            Details
          </h1>
          <div className={style.btn_wrapper}>
            <FontAwesomeIcon
              icon={faShareFromSquare}
              className={style.icons}
              onClick={() => setShareLink(true)}
            />
            <FontAwesomeIcon icon={faPrint} className={style.icons} onClick={onPrint} />
            {user?.type === "candidate" && (
              <div className={style.iconWithTooltip}>
                <Image
                  onClick={() => setReportModal(true)}
                  src={exclamationIcon}
                  className={style.infoIcons}
                  alt="exclamation-icon"
                  width={24}
                  height={24}
                />
                <div className={style.tooltip}>
                  <span>Report this Job</span>
                </div>
              </div>
            )}{" "}
            <div
              style={{
                position: "absolute",
                top: shareLink ? "30px" : "-1000px",
                transition: "all 1.5s",
                zIndex: 2600,
                width: "220px",
                right: "45px",
              }}
            >
              <ForwardPopUp setShareLink={setShareLink} shareLink={shareLink} jobData={jobData} />
            </div>
          </div>
        </Container>
      </div>
      <ReportModal {...{ reportModal, setReportModal }} />
    </>
  );
};

export default HeaderSection;
export const navLinksArr = [
  { title: "Profile", path: "/profile-overview/profile", show: true },
  { title: "Personal Info.", path: "/profile-overview/personal-information", show: true },
  { title: "About", path: "/profile-overview/about", show: true },
  { title: "Availability", path: "/profile-overview/availability", show: true },
  { title: "Experience", path: "/profile-overview/experience", show: true },
  {
    title: "Skills & Driver Licenses",
    path: "/profile-overview/skills-driver-license",
    show: true,
  },
  { title: "My CV/Resume", path: "/profile-overview/my-resume", show: true },
  { title: "Diploma & Certification", path: "/profile-overview/certificates", show: true },
  { title: "References", path: "/profile-overview/references", show: true },
  { title: "My Uploads", path: "/profile-overview/my-upload", show: true },
  { title: "Change Password", path: "/profile-overview/change-password", show: false },
  { title: "Delete Profile", path: "/profile-overview/delete-account", show: false },
  { title: "Settings", path: "/profile-overview/settings", show: true },
];
