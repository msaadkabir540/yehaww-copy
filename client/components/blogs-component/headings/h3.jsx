import React from "react";
import style from "./heading.module.scss";

const Heading3 = ({ children, italic, bold, underline, strikeThrough }) => {
  return (
    <>
      <h3
        className={style.h3}
        style={{
          fontWeight: bold && 600,
          fontStyle: italic && "italic",
          textDecoration: underline && "underline",
          textDecorationLine: strikeThrough && "line-through",
        }}
      >
        {children}
      </h3>
    </>
  );
};

export default Heading3;
