/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import LookingCards from "./looking-cards";
import Container from "components/container";

import trueLogo from "public/assets/icons/true.svg";
import plusIcon from "public/assets/plus.svg";
import searchingBanner from "public/assets/searching.svg";

import style from "./looking.module.scss";

const LookingSection = () => {
  return (
    <Container>
      <div className={style.card}>
        <h2>Searching for a job? </h2>
        <p className={style.infopara}>
          With the first of its kind database created to connect talented people in the equine
          industry, Yehaww will find the perfect position for you! Our applicants accounts will
          provide you with :
        </p>
        <div className={style.contents}>
          <div>
            <div className={style.commonclass}>
              <Image src={trueLogo} width={24} height={24} alt="check-icon" />
              <p>Help to create an attractive profile</p>
            </div>
            <div className={style.commonclass}>
              <Image src={trueLogo} width={24} height={24} alt="check-icon" />
              <p>Questions to pinpoint the right job for you</p>
            </div>
            <div className={style.commonclass}>
              <Image src={trueLogo} width={24} height={24} alt="check-icon" />
              <p>Freelancing opportunities </p>
            </div>
            <div className={style.commonclass}>
              <Image src={trueLogo} width={24} height={24} alt="check-icon" />
              <p>Protection of your privacy</p>
            </div>
            <div className={style.commonclass}>
              <Image src={trueLogo} width={24} height={24} alt="check-icon" />
              <p>Upload your video </p>
            </div>
            <div className={style.commonclass}>
              <Image src={plusIcon} width={24} height={24} alt="plus-icon" />
              <p>And more…</p>
            </div>
          </div>
          <div className={style.imgRec}>
            <Image src={searchingBanner} alt="searching-banner" />
          </div>
        </div>
        <div className={style.gridTHree}>
          <h3>Pick one of our applicants accounts</h3>

          <LookingCards />
        </div>
      </div>
    </Container>
  );
};

export default LookingSection;
