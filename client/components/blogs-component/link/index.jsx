import React from "react";
import style from "./link.module.scss";

const LinkComponent = ({ children, underline }) => {
  const link = children?.[0]?.props?.text;
  return (
    <>
      <a
        href={link}
        target="_blank"
        className={style.p}
        style={{ textDecoration: underline && "underline" }}
      >
        {children}
      </a>
    </>
  );
};

export default LinkComponent;
