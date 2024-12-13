/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "components/container";
import BreadCrumb from "components/bread-crumb";
import ResponsiveTabsPopUp from "./tabs-responsive";

import style from "./overview.module.scss";
import HeaderComponent from "components/header-compo";

const OverviewSection = ({ children }) => {
  const { pathname } = useRouter();
  const [popUp, setPopUp] = useState(false);

  return (
    <>
      <HeaderComponent heading={"My Profile"} />
      <div className={style.headingDiv}>
        <Container>
          <BreadCrumb
            className={style.breadCrumb}
            containerClass={style.breadCrumbContainer}
            data={navLinksArr}
          />
          <div className={style.mainJob}>
            <div className={style.tabDiv}>
              <ul className={style.navMenuWrapper}>
                {navLinksArr.map(
                  ({ path, title, show }) =>
                    show && (
                      <li key={title}>
                        <Link href={path}>
                          <p
                            style={{
                              color: pathname === path ? "#b29e85" : "",
                              border: pathname === path ? "1px solid #b29e85" : "",
                            }}
                          >
                            {title}
                          </p>
                        </Link>
                      </li>
                    )
                )}
              </ul>
              <FontAwesomeIcon
                icon={faBars}
                className={style.icon1}
                onClick={() => setPopUp(true)}
              />

              <div
                style={{
                  position: "absolute",
                  top: popUp ? "40px" : "-1000px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "250px",
                  left: "0px",
                }}
              >
                <ResponsiveTabsPopUp
                  setPopUpJob={setPopUp}
                  popUpJob={popUp}
                  navLinksArr={navLinksArr}
                  pathname={pathname}
                />
              </div>
              <BreadCrumb
                className={style.breadCrumb}
                containerClass={style.breadCrumbContainer1}
                data={navLinksArr}
              />
            </div>
            <div className={style.profileWrapper}>{children}</div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default OverviewSection;

export const navLinksArr = [
  { title: "Profile", path: "/profile-overview/profile", show: true },
  { title: "Personal Info", path: "/profile-overview/personal-information", show: true },
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
