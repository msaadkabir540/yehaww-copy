/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";

import Container from "components/container";
import FooterSmall from "./footer-small";

import transparentLogo from "public/assets/icons/yee-logo-transparent.webp";

import style from "./footer.module.scss";

const Footer = () => {
  const { pathname } = useRouter();

  return (
    <>
      <div className={style.footerMain}>
        <Container>
          <div className={style.gridClass}>
            <Link href="/">
              <div className={style.rightDiv}>
                <Image src={transparentLogo} className={style.img} alt="mobile" />
              </div>
            </Link>
            <div className={style.company}>
              <h6>Company</h6>
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
            </div>
            <div className={style.company}>
              <h6>Positions</h6>
              <Link href={"/jobs/Showjumping"}>
                <p className={pathname === "/" ? style.active : ""}>Show Jumping</p>
              </Link>
              <Link href={"/jobs/Dressage"}>
                <p className={pathname === "/" ? style.active : ""}>Dressage</p>
              </Link>
              <Link href={"/jobs/Eventing"}>
                <p className={pathname === "/" ? style.active : ""}>Eventing</p>
              </Link>
              <Link href={"/jobs/Driving"}>
                <p className={pathname === "/" ? style.active : ""}>Driving</p>
              </Link>
              <Link href={"/jobs/Hunter"}>
                <p className={pathname === "/" ? style.active : ""}>Hunter</p>
              </Link>
            </div>
            <div className={style.company}>
              <h6>Legal</h6>
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
                <p className={pathname === "/advertise" ? style.active : ""}>Advertise with us</p>
              </Link>
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
      <FooterSmall />
    </>
  );
};

export default Footer;
