import React from "react";
import style from "./heading.module.scss";

const Heading4 = ({ children, italic, bold, underline, strikeThrough }) => {
  return (
    <>
      <h4
        className={style.h4}
        style={{
          fontWeight: bold && 600,
          fontStyle: italic && "italic",
          textDecoration: underline && "underline",
          textDecorationLine: strikeThrough && "line-through",
        }}
      >
        {children}
      </h4>
    </>
  );
};

export default Heading4;
