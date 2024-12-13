/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";

import Container from "components/container";

import style from "./footerSmall.module.scss";
import transparentLogo from "public/assets/icons/yee-logo-transparent.webp";
import arrow from "public/assets/white-dropdown.webp";
import Image from "next/image";

const FooterSmall = () => {
  const { pathname, push } = useRouter();
  const [openLegal, setOpenLegal] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);

  return (
    <>
      <div className={style.footerSmall}>
        <Container>
          <div
            className={style.rightDiv}
            style={{
              paddingBottom: "60px ",
            }}
          >
            <Link href="/">
              <div className={style.logo}>
                <Image
                  src={transparentLogo}
                  width={200}
                  height={100}
                  alt="yehaww-horse-logo-transparent"
                  className={style.logo}
                />
              </div>
            </Link>
            <div className={style.gridClass}>
              <div className={style.company}>
                <div
                  className={style.mainClass}
                  onClick={() => {
                    setOpenCompany(!openCompany);
                    setOpenPosition(false);
                    setOpenLegal(false);
                  }}
                >
                  <h6>Company</h6>
                  <div className={style.img}>
                    <Image height={10} width={16} src={arrow} alt="arrow-icon" />
                  </div>
                </div>
                <div
                  className={style.absolute}
                  style={{
                    top: openCompany ? "27px" : "-100%",
                    transition: "all 1.7s",
                    zIndex: 5,
                  }}
                >
                  {openCompany ? (
                    <>
                      <Link href="/">
                        <p className={pathname === "/" ? style.active : ""}>Home</p>
                      </Link>
                      <Link href="/about-us">
                        <p className={pathname === "/about-us" ? style.active : ""}>About Us</p>
                      </Link>
                      <Link href="/faq">
                        <p className={pathname === "/faq" ? style.active : ""}>FAQ</p>
                      </Link>
                      <Link href="/contact-us">
                        <p className={pathname === "/contact-us" ? style.active : ""}>Contact Us</p>
                      </Link>
                      <Link href="#partners">
                        <p className={pathname === "/" ? style.active : ""}>Our Partners</p>
                      </Link>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className={style.company}>
                <div
                  className={style.mainClass}
                  onClick={() => {
                    setOpenPosition(!openPosition);
                    setOpenCompany(false);
                    setOpenLegal(false);
                  }}
                >
                  <h6>Positions</h6>
                  <div className={style.img}>
                    <Image height={10} width={16} src={arrow} alt="arrow-icon" />
                  </div>
                </div>
                <div
                  className={style.absolute}
                  style={{
                    top: openPosition ? "27px" : "-100%",
                    transition: "all 1.7s",
                    zIndex: 5,
                  }}
                >
                  {openPosition && (
                    <>
                      {links.map(({ link, name }) => (
                        <p
                          className={pathname === "/" ? style.active : ""}
                          onClick={() => {
                            push(link);
                            setOpenPosition(false);
                          }}
                        >
                          {name}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className={style.company}>
                <div
                  className={style.mainClass}
                  onClick={() => {
                    setOpenLegal(!openLegal);
                    setOpenCompany(false);
                    setOpenPosition(false);
                  }}
                >
                  <h6>Legal</h6>
                  <div className={style.img}>
                    <Image height={10} width={16} src={arrow} alt="arrow-icon" />
                  </div>
                </div>
                <div
                  className={style.absolute}
                  style={{
                    top: openLegal ? "27px" : "-100%",
                    transition: "all 1.7s",
                    zIndex: 5,
                  }}
                >
                  {openLegal && (
                    <>
                      <Link href="/terms-privacy">
                        <p className={pathname === "/terms-privacy" ? style.active : ""}>
                          {" "}
                          Terms & Conditions
                        </p>
                      </Link>

                      <Link href="/privacy-policy">
                        <p className={pathname === "/privacy-policy" ? style.active : ""}>
                          {" "}
                          Privacy Policy
                        </p>
                      </Link>

                      <Link href="/cookies-policy">
                        <p className={pathname === "/cookies-policy" ? style.active : ""}>
                          {" "}
                          Cookies Policy
                        </p>
                      </Link>
                      <Link href="/advertise">
                        <p className={pathname === "/advertise" ? style.active : ""}>
                          Advertise with us
                        </p>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={style.flexInner}>
            <div className={style.logosImg}>
              <a href="https://www.facebook.com/Yehaww-100714195979410" target="_blank">
                <div className={style.logo}>
                  <FontAwesomeIcon className={style.icon} icon={faFacebookF} />
                </div>
              </a>
              <a href="https://www.instagram.com/yehaww_com/" target="_blank">
                <div className={style.logo}>
                  <FontAwesomeIcon className={style.icon} icon={faInstagram} />
                </div>
              </a>
              <a href="https://www.linkedin.com/company/yehaww/" target="_blank">
                <div className={style.logo}>
                  <FontAwesomeIcon className={style.icon} icon={faLinkedin} />
                </div>
              </a>
            </div>
            <p>© {new Date().getFullYear()} Yehaww LLC All Right Reserved.</p>
          </div>
        </Container>
      </div>
      {openPosition || openLegal || openCompany ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "transparent",
            zIndex: 3,
          }}
          onClick={() => {
            setOpenPosition(false);
            setOpenLegal(false);
            setOpenCompany(false);
          }}
        ></div>
      ) : (
        ""
      )}
    </>
  );
};

export default FooterSmall;

const links = [
  { link: "/jobs/Showjumping", name: "Show Jumping" },
  { link: "/jobs/Dressage", name: "Dressage" },
  { link: "/jobs/Eventing", name: "Eventing" },
  { link: "/jobs/Driving", name: "Driving" },
  { link: "/jobs/Hunter", name: "Hunter" },
];
