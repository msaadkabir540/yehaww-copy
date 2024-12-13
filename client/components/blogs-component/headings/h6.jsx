import React from "react";
import style from "./heading.module.scss";

const Heading6 = ({ children, italic, bold, underline, strikeThrough }) => {
  return (
    <>
      <h6
        className={style.h6}
        style={{
          fontWeight: bold && 600,
          fontStyle: italic && "italic",
          textDecoration: underline && "underline",
          textDecorationLine: strikeThrough && "line-through",
        }}
      >
        {children}
      </h6>
    </>
  );
};

export default Heading6;
