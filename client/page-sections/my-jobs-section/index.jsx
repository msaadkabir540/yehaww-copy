/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "components/container";
import BreadCrumb from "components/bread-crumb";
import ResponsiveTabs from "page-sections/find-crew/responsive-tabs";

import style from "./job.module.scss";
import HeaderComponent from "components/header-compo";

const MyJobsSectionWrapper = ({ children }) => {
  const { pathname } = useRouter();
  const [popUp, setPopUp] = useState(false);

  return (
    <div>
      <HeaderComponent heading={"Find Candidate"} />

      <div className={style.headingDiv}>
        <Container>
          <BreadCrumb
            className={style.breadCrumb}
            containerClass={style.breadCrumbContainer}
            data={navLinks}
          />
          <div className={style.mainJob}>
            <div className={style.small}>
              <div className={style.tabDiv}>
                {navLinks.map(
                  ({ path, title, show }) =>
                    show && (
                      <Link href={path} key={path}>
                        <p
                          style={{
                            color: pathname === path ? "#b29e85" : "",
                            border: pathname === path ? "1px solid #b29e85" : "",
                          }}
                        >
                          {title}
                        </p>
                      </Link>
                    )
                )}
              </div>
              <FontAwesomeIcon
                icon={faBars}
                className={style.icon1}
                onClick={() => setPopUp(true)}
              />
              <div
                style={{
                  position: "absolute",
                  top: popUp ? "70px" : "-1000px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "250px",
                  left: "0px",
                }}
              >
                <ResponsiveTabs
                  popUpJob={popUp}
                  pathname={pathname}
                  setPopUpJob={setPopUp}
                  navLinksArr={navLinks}
                />
              </div>
              <BreadCrumb
                className={style.breadCrumb}
                containerClass={style.breadCrumbContainer1}
                data={navLinks}
              />
            </div>
            <div>{children}</div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default MyJobsSectionWrapper;

export const navLinks = [
  { title: "Jobs", path: "/jobs", show: false },
  { title: "Search", path: "/jobs", show: true },
  { title: "My Jobs", path: "/jobs/my-jobs", show: true },
  { title: "My Profile", path: "/profile-overview/profile", show: true },
  { title: "My Video Interviews", path: "/jobs/video-interviews", show: true },
];
