import React from "react";
import style from "./paragraph.module.scss";

const Paragraph = ({ children }) => {
  return (
    <>
      <p className={style.p}>{children}</p>
    </>
  );
};

export default Paragraph;
