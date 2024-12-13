/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import trueLogo from "public/assets/imgs/banner1.webp";
import trueLogo1 from "public/assets/imgs/banner1-mobile.webp";
import style from "./banner1.module.scss";

const BannerImageSection = () => {
  return (
    <div className={style.bannerImageSection}>
      <div className={style.imgWeb}>
        <Image src={trueLogo} width={"100%"} height={"100%"} alt="mobile" />
      </div>
      <div className={style.imgSmall}>
        <Image src={trueLogo1} width={"100%"} height={"100%"} alt="mobile" />
      </div>
    </div>
  );
};

export default BannerImageSection;
