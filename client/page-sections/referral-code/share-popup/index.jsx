import { useMemo, useRef } from "react";
import Image from "next/image";

import copy from "public/assets/icons/copy.svg";
import twitter from "public/assets/icons/twitterX.svg";
import whatsapp from "public/assets/icons/whatsappX.svg";
import linkedIn from "public/assets/icons/linkedIn-blue.svg";
import logos_facebook from "public/assets/icons/logos_facebook.svg";
import google from "public/assets/icons/google.svg";
import instagram from "public/assets/icons/insta.svg";

import createNotification from "common/create-notification";
import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./share-popup.module.scss";

const SharePopUp = ({ setMenuPopUp, referral }) => {
  const wrapperRef = useRef(null);

  const link = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up/employer?referral-code=${referral}`;
  }, [referral]);

  const handleOptionClick = () => {
    setMenuPopUp(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(link);
    createNotification("success", "Link Copied");
  };

  useOutsideClickHook(wrapperRef, () => {
    setTimeout(() => {
      setMenuPopUp(false);
    }, 250);
  });

  const textToShare = "You can Avail Discounts on the Subscription Plans!";

  return (
    <div className={style.mainInner} ref={wrapperRef}>
      <span className={style.head}>Share</span>

      <div className={style.innerFlex} onClick={handleCopyToClipboard}>
        <Image alt="Copy link" src={copy} width={20} height={20} className={style.icons} />
        <p onClick={handleOptionClick}>Copy Link</p>
      </div>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          link
        )}&quote=${encodeURIComponent(textToShare)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={style.innerFlex}>
          <Image
            alt="Share on Facebook"
            src={logos_facebook}
            width={20}
            height={20}
            className={style.icons}
          />
          <p>Facebook</p>
        </div>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          link
        )}&text=${encodeURIComponent(textToShare)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={style.innerFlex}>
          <Image
            alt="Share on Twitter"
            src={twitter}
            width={20}
            height={20}
            className={style.icons}
          />
          <p>Twitter</p>
        </div>
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          link
        )}&title=${encodeURIComponent(textToShare)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={style.innerFlex}>
          <Image
            alt="Share on LinkedIn"
            src={linkedIn}
            width={20}
            height={20}
            className={style.icons}
          />
          <p>LinkedIn</p>
        </div>
      </a>

      <a
        href={`https://wa.me?text=${encodeURIComponent(textToShare)}%0A${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={style.innerFlex}>
          <Image
            alt="Share on WhatsApp"
            src={whatsapp}
            width={20}
            height={20}
            className={style.icons}
          />
          <p>WhatsApp</p>
        </div>
      </a>

      <a
        href={`mailto:?subject=${encodeURIComponent("Check this out!")}&body=${encodeURIComponent(
          textToShare
        )}%0A${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={style.innerFlex}>
          <Image
            alt="Share via Google (Email)"
            src={google}
            width={20}
            height={20}
            className={style.icons}
          />
          <p>Google (Email)</p>
        </div>
      </a>

      <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
        <div className={style.innerFlex}>
          <Image
            alt="Share on Instagram"
            src={instagram}
            width={20}
            height={20}
            className={style.icons}
          />
          <p>Instagram</p>
        </div>
      </a>
    </div>
  );
};

export default SharePopUp;
