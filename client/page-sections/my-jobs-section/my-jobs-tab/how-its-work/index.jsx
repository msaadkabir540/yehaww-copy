/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import searchImg from "public/assets/searchh.webp";
import profileImg from "public/assets/profile.webp";
import applyImg from "public/assets/apply.svg";
import shortImg from "public/assets/shortlisted.svg";
import style from "./how-its-work.module.scss";

const HowItsWork = () => {
  return (
    <div className={style.parent}>
      <h2>How It Works</h2>

      <div className={style.timeline}>
        {data?.map((ele, index) => (
          <div
            className={style.innerClass}
            key={index}
            style={{ display: "flex", alignItems: "flex-start" }}
          >
            <div className={style.img_sec}>
              <div className={style.img}>
                <Image src={ele.img} alt="no image" />
              </div>
            </div>
            <div className={style.entry}>
              <div className={style.circle} data-index={index + 1}></div>
              <div className={style.details_sec}>
                <span>{ele.heading}</span>
                <p className={style.p2}>{ele.para}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItsWork;

const data = [
  {
    img: searchImg,
    heading: "Profile",
    para: " Create your personalized profile online for free. Fill in the questionnaire with your specific preferences to let the database know what you are looking for.",
  },
  {
    img: profileImg,
    heading: "Search",
    para: "Start looking for a job by choosing between the two applicant accounts “Hands on” or “Stay clean” to find the position you are looking for",
  },
  {
    img: applyImg,
    heading: "Apply",
    para: "Once you discover a job that seems interesting, simply choose “show interest” By choosing the “My Jobs” button in your profile, you can follow the status of your application. Here you can also answer any messages the employers might have sent to you",
  },

  {
    img: shortImg,
    heading: "Shortlisted",
    para: "If you have the criteria the employer is looking for you will be shortlisted for the position and the employer is likely to contact you.",
  },
];
