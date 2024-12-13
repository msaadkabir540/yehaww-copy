import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Container from "components/container";
import ResponsiveTabs from "./responsive-tabs";
import BreadCrumb from "components/bread-crumb";
import BorderForm from "components/border-form";
import HeaderComponent from "components/header-compo";

import style from "./find-crew.module.scss";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FindCandidateWrapper = ({ children }) => {
  const { pathname } = useRouter();
  const [popUp, setPopUp] = useState(false);

  return (
    <div className={style.parentDiv}>
      <HeaderComponent heading="Find Candidate" />
      <Container>
        <div className={style.mainJob}>
          <FontAwesomeIcon icon={faBars} className={style.icon} onClick={() => setPopUp(true)} />
          <BreadCrumb
            className={style.breadCrumb}
            containerClass={style.breadCrumbContainer}
            data={navLinksArr}
          />
        </div>
        <BorderForm>
          <div className={style.tabDiv}>
            {navLinksArr.map(
              ({ path, title, show }, index) =>
                show && (
                  <Link href={path} key={index}>
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
          <div
            style={{
              position: "absolute",
              top: popUp ? "60px" : "-1000px",
              transition: "all 1.5s",
              zIndex: 2600,
              width: "250px",
              left: "30px",
            }}
          >
            <ResponsiveTabs
              setPopUpJob={setPopUp}
              popUpJob={popUp}
              navLinksArr={navLinksArr}
              pathname={pathname}
            />
          </div>
          <div>{children}</div>
        </BorderForm>
      </Container>
    </div>
  );
};

export default FindCandidateWrapper;

export const navLinksArr = [
  {
    title: "Find Candidate",
    path: "/candidate/search",
    show: false,
  },
  {
    title: "Search",
    path: "/candidate/search",
    show: true,
  },
  { title: "Post a Position", path: "/candidate/post-position", show: true },
  { title: "Draft-Posts", path: "/candidate/draft-post", show: true },
  { title: "Active-posts", path: "/candidate/active-post", show: true },
  { title: "All Shortlisted", path: "/candidate/all-shortlisted", show: true },
];
