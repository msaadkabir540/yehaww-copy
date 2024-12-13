/* eslint-disable @next/next/no-img-element */
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";

import RadialSeparators from "./RadialSeparators";
import SettingsProfile from "../settings-profile";

import { useProfile } from "../helper";

import editInfo from "public/assets/edit-info.svg";
import tickIcon from "public/assets/tick.svg";
import crossIcon from "public/assets/cross.svg";
import style from "./complete.module.scss";

const ProfileComplete = () => {
  const { user } = useSelector((state) => state.app);
  const { profileStatuses, userData } = useProfile();

  return (
    <>
      <div className={style.header}>
        <div className={style.left}>
          <div className={style.img}>
            <Image
              src={user?.candidate?.uploads?.mainPhoto || "/assets/icons/avatar.svg"}
              alt="Profile-Img"
              width={"100%"}
              height={"100%"}
              className={style.img}
            />
          </div>
          <div>
            <h6>{`${user?.forename} ${user?.surname}`}</h6>
            <div className={style.flex}>
              <p style={{ width: "55px" }}>Email</p>
              <span>:</span>
              <p>{user?.email}</p>
            </div>
            <div className={style.flex}>
              <p style={{ width: "55px" }}>Type</p> <span>:</span>
              <p>{user?.type?.charAt(0)?.toUpperCase() + user?.type?.slice(1)}</p>
            </div>
          </div>
        </div>
        <div style={{ width: 120, height: 120 }}>
          <CircularProgressbarWithChildren
            value={userData?.profileCompletion}
            text={`${userData?.profileCompletion || 0}%`}
            strokeWidth={10}
            styles={buildStyles({
              strokeLinecap: "butt",
              textColor: "#252525",
              pathColor: "#10B981",
              backgroundColor: "#BCCCBF",
              trailColor: "#BCCCBF",
              textSize: "16px",
            })}
          >
            <RadialSeparators
              count={12}
              style={{
                background: "#ffffff",
                width: "2px",
                height: `${10}%`,
              }}
            />
          </CircularProgressbarWithChildren>
        </div>
      </div>
      {userData?.profileCompletion < 100 && (
        <>
          <p>
            Your profile will be visible once all mandatory questions are filled in. We highly
            recommend to complete the profile.
          </p>
          <p>
            Not only will it make you more attractive to the employer but it will also give you the
            best chance to find your dream job.
          </p>
        </>
      )}
      <div className={style.grid}>
        {profileStatuses.map(({ title, status, path }, index) => (
          <div className={style.dgDiv} key={index}>
            <div className={style.innerFlex}>
              <Image
                height={21}
                width={21}
                src={status !== "Incomplete" ? tickIcon : crossIcon}
                alt="tickIcon"
              />
              <div className={style.paraDiv}>
                <h5>{title}</h5>
                <span className={status !== "Completed" ? style.danger : ""}>{status}</span>
              </div>
            </div>
            <div className={style.imgSmall}>
              <Link href={path}>
                <div className={style.img}>
                  <Image src={editInfo} alt="editIcon" />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className={style.mainHidden}>
        <SettingsProfile />
      </div>
    </>
  );
};

export default ProfileComplete;
