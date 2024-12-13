import React from "react";
import Link from "next/link";

import style from "./share-profile.module.scss";
import { useSelector } from "react-redux";

const ShareProfile = () => {
  const { user } = useSelector((state) => state.app);
  const profileLink = `${process.env.NEXT_PUBLIC_BASE_URL}/u/${user?.profileLinkId}?email=${user.email}`;

  return (
    <div className={style.form_container}>
      <div className={style.headerWrapper}>
        <h2>Are you tired of uploading your CV and documents?</h2>
        <p className={style.headerContent}>
          If you are applying for jobs and opportunities which are not on{" "}
          <span>www.yehaww.com</span> then just send them your profile via email. It's simple and
          easy.
        </p>
      </div>
      <div className={style.contentWrapper}>
        <h2>Here's a link to your profile</h2>
        <p className={style.linkWrapper}>
          <Link href={profileLink}>
            <a className={style.profileLink} target={"_blank"}>
              {profileLink}
            </a>
          </Link>
        </p>
        <p className={style.content}>
          Just copy & paste this link to share your profile publicly. This unique link will expire
          every two weeks.{" "}
          <Link href={"/privacy-policy"}>
            <a className={style.profileLink}>Click here</a>
          </Link>{" "}
          to read our Privacy Policy
        </p>
        <p className={style.content}>The yehaww Team</p>
      </div>
    </div>
  );
};

export default ShareProfile;
