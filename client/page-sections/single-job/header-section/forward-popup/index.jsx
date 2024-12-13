import { useRef } from "react";
import {
  faFacebook,
  faGooglePlus,
  faLinkedin,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./forward-popup.module.scss";

const ForwardPopUp = ({ setShareLink, jobData: { _id, companyInfo, jobTitle } }) => {
  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setShareLink(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <span className={style.head}>Share this page</span>
        <a
          href={`https://twitter.com/intent/tweet?url=${
            process.env.NEXT_PUBLIC_BASE_URL
          }/jobs/details/${_id}&text=${
            companyInfo?.companyName ? companyInfo?.companyName : "Anonymous"
          } is looking for a ${jobTitle}`}
          target="_blank"
        >
          <div className={style.innerFlex}>
            <p onClick={() => setShareLink(false)}>Twitter</p>
            <FontAwesomeIcon icon={faTwitter} className={style.icons} />
          </div>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_BASE_URL}/jobs/details/${_id}`}
          target="_blank"
        >
          <div className={style.innerFlex}>
            <p onClick={() => setShareLink(false)}>Facebook</p>
            <FontAwesomeIcon icon={faFacebook} className={style.icons} />
          </div>
        </a>

        <a
          href={`https://currents.google.com/up/?continue=https://currents.google.com/share?url=${process.env.NEXT_PUBLIC_BASE_URL}/jobs/details/${_id}`}
          target="_blank"
        >
          <div className={style.innerFlex}>
            <p onClick={() => setShareLink(false)}>Google Plus</p>
            <FontAwesomeIcon icon={faGooglePlus} className={style.icons} />
          </div>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_BASE_URL}/jobs/details/${_id}`}
          target="_blank"
        >
          <div className={style.innerFlex}>
            <p onClick={() => setShareLink(false)}>Linkedin</p>
            <FontAwesomeIcon icon={faLinkedin} className={style.icons} />
          </div>
        </a>
        <a
          href={`https://wa.me?text=${
            companyInfo?.companyName ? companyInfo?.companyName : "Anonymous"
          } is looking for a ${jobTitle}%0A${process.env.NEXT_PUBLIC_BASE_URL}/jobs/details/${_id}`}
          target="_blank"
        >
          <div className={style.innerFlex}>
            <p onClick={() => setShareLink(false)}>WhatsApp</p>
            <FontAwesomeIcon icon={faWhatsapp} className={style.icons} />
          </div>
        </a>
      </div>
    </>
  );
};

export default ForwardPopUp;
