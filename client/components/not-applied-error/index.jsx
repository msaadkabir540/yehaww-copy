import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from "./not-applied.module.scss";

const NotAppliedErrorMessage = ({ paraText, clickText, onClick }) => {
  return (
    <div className={style.mainError}>
      <FontAwesomeIcon icon={faTriangleExclamation} className={style.icon} />
      <p>
        {paraText} <span onClick={onClick}>{clickText}</span>
      </p>
    </div>
  );
};

export default NotAppliedErrorMessage;
