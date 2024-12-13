import React from "react";

import style from "./compo.module.scss";

const HeaderComponent = ({ heading, paragraph, spanText }) => {
  return (
    <div className={style.mainHeader}>
      <h6>{heading}</h6>
      {paragraph && (
        <p>
          {paragraph} <span>{spanText}</span>
        </p>
      )}
    </div>
  );
};

export default HeaderComponent;
