// /* eslint-disable @next/next/no-img-element */

import React from "react";
import Link from "next/link";
import Image from "next/image";

import JobPopUp from "./job-popup";
import MorePopUp from "./more-popup";
import Button from "components/button";
import NavbarPopUp from "./navbar-popup";
import Loading from "components/loading";
import Container from "components/container";
import BrowseYeehaw from "./browse-yeehaw";
import CandidatePopUp from "./candidate-popup";

import { useNavbar } from "./helper";
import { isWindowDefined } from "utils/helper";

import style from "./navbar.module.scss";
import arrowDown from "public/assets/icons/down-arrow.svg";
import logoLeft from "public/assets/icons/logo.webp";

const Navbar = () => {
  const {
    user,
    popUp,
    token,
    browse,
    navLink,
    pathname,
    popUpJob,
    setPopUp,
    setBrowse,
    popUpMore,
    appLoader,
    setPopUpJob,
    mobileBrowse,
    setPopUpMore,
    popUpCandidate,
    mobilePopUpJob,
    setMobileBrowse,
    mobilePopUpMore,
    setPopUpCandidate,
    setMobilePopUpJob,
    setMobilePopUpMore,
    mobilePopUpCandidate,
    handleClickBlackFriday,
    setMobilePopUpCandidate,
  } = useNavbar();

  const navActive = (path) => {
    return pathname === "/"
      ? style.home_nav
      : pathname.includes(path)
      ? `${style.active} ${style.home_nav}`
      : style.home_nav;
  };

  return (
    <>
      <div className={style.mainNav}>
        <Container>
          <div className={style.innerDiv}>
            <div className={style.leftDiv}>
              <Link href="/">
                <div className={style.img}>
                  <Image src={logoLeft} height={50} width={218} alt="logo" className={style.img} />
                </div>
              </Link>
            </div>
            <div className={style.innerLinks}>
              {navLink.map(({ path, name, click, pathMatch }, index) => {
                return (
                  <React.Fragment key={index}>
                    {((user?.type === "candidate" && path === "/jobs") ||
                      (user?.type === "employer" && path === "/find-candidate") ||
                      path === "/more" ||
                      path === "/news" ||
                      path === "/subscription" ||
                      path === "/position") &&
                    isWindowDefined() ? (
                      <ul>
                        <li className={navActive(pathMatch)} onClick={click}>
                          {name}
                        </li>
                      </ul>
                    ) : (
                      <Link href={path}>
                        <a className={navActive(pathMatch)}>{name}</a>
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
              <div
                style={{
                  position: "absolute",
                  top: popUpJob ? "60px" : "-500px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "250px",
                }}
              >
                {popUpJob && <JobPopUp setPopUpJob={setPopUpJob} popUpJob={popUpJob} />}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: popUpCandidate ? "60px" : "-500px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "250px",
                }}
              >
                {popUpCandidate && (
                  <CandidatePopUp
                    setPopUpCandidate={setPopUpCandidate}
                    popUpCandidate={popUpCandidate}
                  />
                )}
              </div>
              <div
                className={style.morepopup}
                style={{
                  top: popUpMore ? "60px" : "-500px",
                }}
              >
                {popUpMore && (
                  <MorePopUp user={user} setPopUpMore={setPopUpMore} popUpMore={popUpMore} />
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: browse ? "60px" : "-500px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "90%",
                  left: "0px",
                  right: "0px",
                  margin: "auto",
                }}
              >
                {browse && <BrowseYeehaw setBrowse={setBrowse} browse={browse} />}
              </div>
            </div>
            <div className={style.rightDiv}>
              {token === "" ? (
                <>
                  {pathname !== "/login" && (
                    <Link href="/login">
                      <a className={style.loginClassLink}>
                        <Button title="Login" className={style.loginHomeBtn} />
                      </a>
                    </Link>
                  )}
                  {pathname !== "/sign-up" && (
                    <Link href="/sign-up">
                      <a>
                        <Button title="Sign Up Free" className={style.signUpHomeBtn} />
                      </a>
                    </Link>
                  )}
                </>
              ) : (
                <div style={{ position: "relative" }}>
                  {!user.type || appLoader ? (
                    <Loading />
                  ) : (
                    <div className={style.navbarLogin} onClick={() => setPopUp(true)}>
                      <div className={style.innerDiv}>
                        <Image
                          src={
                            user?.candidate?.uploads?.mainPhoto ||
                            user?.employer?.personalDetails?.profilePicture ||
                            "/assets/icons/avatar.svg"
                          }
                          height={30}
                          width={30}
                          alt="user_profile"
                        />
                        <div>
                          <h6 style={{ color: "#B29E85", textTransform: "capitalize" }}>
                            {`${user?.forename} ${user?.surname}`}
                          </h6>
                          <p style={{ color: "#2c2c2c" }}>
                            {user?.type?.charAt(0)?.toUpperCase() + user?.type?.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className={style.arrowImg}>
                        <Image src={arrowDown} height={"100%"} width={"100%"} alt="arrow_down" />
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: popUp ? "60px" : "-300px",
                      transition: "all 1.5s",
                      zIndex: 2600,
                      width: "250px",
                      right: 0,
                    }}
                  >
                    {popUp && <NavbarPopUp setPopUp={setPopUp} path={pathname} popUp={popUp} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
        <div>
          <Container>
            <div className={style.innerLinksSmall}>
              {navLink.map(({ path, name, click, pathMatch }, index) => {
                return (
                  <React.Fragment key={index}>
                    {((user?.type === "candidate" && path === "/jobs") ||
                      (user?.type === "employer" && path === "/find-candidate") ||
                      path === "/more" ||
                      path === "/news" ||
                      path === "/subscription" ||
                      path === "/position") &&
                    isWindowDefined() ? (
                      <ul>
                        <li className={navActive(pathMatch)} onClick={click}>
                          {name}
                        </li>
                      </ul>
                    ) : (
                      <Link href={path}>
                        <a className={navActive(pathMatch)}>{name}</a>
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
              <div
                style={{
                  position: "absolute",
                  top: mobilePopUpJob ? "60px" : "-700px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "250px",
                }}
              >
                {mobilePopUpJob && (
                  <JobPopUp setPopUpJob={setMobilePopUpJob} popUpJob={mobilePopUpJob} />
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: mobilePopUpCandidate ? "60px" : "-700px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "250px",
                }}
              >
                {mobilePopUpCandidate && (
                  <CandidatePopUp
                    setPopUpCandidate={setMobilePopUpCandidate}
                    popUpCandidate={mobilePopUpCandidate}
                  />
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: mobilePopUpMore ? "60px" : "-700px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "300px",
                }}
              >
                {mobilePopUpMore && (
                  <MorePopUp setPopUpMore={setMobilePopUpMore} popUpMore={mobilePopUpMore} />
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: mobileBrowse ? "60px" : "-700px",
                  transition: "all 1.5s",
                  zIndex: 2600,
                  width: "90%",
                  left: "0px",
                  right: "0px",
                  margin: "auto",
                }}
              >
                {mobileBrowse && <BrowseYeehaw setBrowse={setMobileBrowse} browse={mobileBrowse} />}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Navbar;
