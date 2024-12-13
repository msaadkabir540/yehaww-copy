import React from "react";
import style from "./heading.module.scss";

const Heading1 = ({ children, italic, bold, underline, strikeThrough }) => {
  return (
    <>
      <h1
        className={style.h1}
        style={{
          fontWeight: bold && 600,
          fontStyle: italic && "italic",
          textDecoration: underline && "underline",
          textDecorationLine: strikeThrough && "line-through",
        }}
      >
        {children}
      </h1>
    </>
  );
};

export default Heading1;
