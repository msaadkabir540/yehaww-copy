import React from "react";
import style from "./code.module.scss";

const CodeComponent = ({ children, italic, background }) => {
  return (
    <>
      <p
        className={`${style.code} ${italic && style.italic} ${background && style.backgroundColor}`}
      >
        {children}
      </p>
    </>
  );
};

export default CodeComponent;
