import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import Button from "components/button";

import style from "./header.module.scss";

const HeaderSection = () => {
  return (
    <>
      <div className={style.bgDiv}>
        <div className={style.innerFlex}>
          <FontAwesomeIcon icon={faCircleInfo} className={style.icon} />
          <p> The Crew Platinum Account</p>
        </div>
        <p>Subscribe and receive exclusive discounts, deals and benefits...</p>
        <Button title="Find out more" />
      </div>
    </>
  );
};

export default HeaderSection;
