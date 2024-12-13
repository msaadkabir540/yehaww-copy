import { faFacebookF, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRef } from "react";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./morepopup.module.scss";

const MorePopUp = ({ user, setPopUpMore }) => {
  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setPopUpMore(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <div className={style.head}>
          <h6>More Yehaww</h6>
          <FontAwesomeIcon
            icon={faClose}
            className={style.icon}
            onClick={() => setPopUpMore(false)}
          />
        </div>
        <div className={style.grid}>
          <Link href="/">
            <p>Home</p>
          </Link>
          <div
            onClick={() => {
              setPopUpMore(false);
            }}
          >
            <Link href="/about-us">
              <p>About Us</p>
            </Link>
          </div>
          <div
            onClick={() => {
              setPopUpMore(false);
            }}
          >
            <Link href="/faq">
              <p>FAQ</p>
            </Link>
          </div>
          <div
            onClick={() => {
              setPopUpMore(false);
            }}
          >
            <Link href="/contact-us">
              <p>Contact Us</p>
            </Link>
          </div>
          <div
            onClick={() => {
              setPopUpMore(false);
            }}
          >
            <Link href="/advertise">
              <p>Advertise with Us</p>
            </Link>
          </div>
          <div
            onClick={() => {
              setPopUpMore(false);
            }}
          >
            <Link href="/terms-privacy">
              <p>Terms & Conditions</p>
            </Link>
          </div>
          <div
            onClick={() => {
              setPopUpMore(false);
            }}
          >
            <Link href="/privacy-policy">
              <p>Privacy Policy</p>
            </Link>
          </div>
          <div
            onClick={() => {
              setPopUpMore(false);
            }}
          >
            <Link href="/cookies-policy">
              <p>Cookies Policy</p>
            </Link>
          </div>
          {user?.type !== "candidate" && (
            <div
              onClick={() => {
                setPopUpMore(false);
              }}
            >
              <Link href="/subscription">
                <p>Subscription</p>
              </Link>
            </div>
          )}
        </div>
        <div className={style.logosImg}>
          <a href="https://www.facebook.com/Yehaww-100714195979410" target="_blank">
            <div className={style.square}>
              <FontAwesomeIcon className={style.icon1} icon={faFacebookF} size="2x" />
            </div>
          </a>
          <a href="https://www.instagram.com/yehaww_com/" target="_blank">
            <div className={style.square}>
              <FontAwesomeIcon className={style.icon1} icon={faInstagram} />
            </div>
          </a>
          <a href="https://www.linkedin.com/company/yehaww/" target="_blank">
            <div className={style.square}>
              <FontAwesomeIcon className={style.icon1} icon={faLinkedin} />
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default MorePopUp;
