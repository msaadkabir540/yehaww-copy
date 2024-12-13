import React from "react";
import style from "./heading.module.scss";

const Heading2 = ({ children, italic, bold, underline, strikeThrough }) => {
  return (
    <>
      <h2
        className={style.h2}
        style={{
          fontWeight: bold && 600,
          fontStyle: italic && "italic",
          textDecoration: underline && "underline",
          textDecorationLine: strikeThrough && "line-through",
        }}
      >
        {children}
      </h2>
    </>
  );
};

export default Heading2;
