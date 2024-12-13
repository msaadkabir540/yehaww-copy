/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "components/container";
import ResponsiveTabs from "./responsive-tabs";
import BreadCrumb from "components/bread-crumb";
import HeaderComponent from "components/header-compo";

import { useNews } from "./all-articles/helper";

import style from "./blog.module.scss";

const BlogPage = ({ children }) => {
  const { allPosts } = useNews();
  const { pathname } = useRouter();
  const [popUp, setPopUp] = useState(false);

  return (
    <div>
      <HeaderComponent heading={"News"} />

      <div className={style.headingDiv}>
        <Container>
          <BreadCrumb
            className={style.breadCrumb}
            containerClass={style.breadCrumbContainer}
            data={navLinks}
          />
          <div className={style.mainJob}>
            <div className={style.small}>
              {/* <div className={style.tabDiv}>
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
              </div> */}
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
            <div>
              {children}
              <div className={style.explore}>
                <h3>Explore all topics</h3>
                <div className={style.tagsDiv}>
                  {allPosts?.map((ele, index) => {
                    const words = ele?.title.split(" ");
                    const truncatedTitle = words.slice(0, 3).join(" ");
                    return (
                      <Link href={`/news/inner-news/${ele?.key}`} key={index}>
                        <div
                          className={style.tag}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <p>{truncatedTitle}</p>
                        </div>
                      </Link>
                    );
                  })}
                  {exploreData?.map((ele, index) => (
                    <div className={style.tag} key={index}>
                      <p>{ele}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BlogPage;

export const navLinks = [
  { title: "News", path: "/news", show: false },
  { title: "All Articles", path: "/news", show: true },
  { title: "Inner News", path: "/news/inner-news", show: false },
];

const exploreData = [
  "Technology of handson",
  "Working with Checker",
  "Working with API",
  "Use cases",
  "New training tools",
  "Voice Assistants",
  "Horses health",
  "Symptom checkers ",
  "Product updates",
  "Health insurance trends",
  "Modern triage",
  "Modern horse",
  "Machine learning",
  "Insights for investors",
  "Essay",
  "Knowledge Base",
  "Implementation tips",
  "Interview",
  "Health insurance trends",
  "Future of horses use",
  "Horse Health personnel",
  "Digital transformation of healthcare industry",
  "Future of horses",
  "Company",
];
