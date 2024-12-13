import React from "react";
import style from "./heading.module.scss";

const Heading5 = ({ children, italic, bold, underline, strikeThrough }) => {
  return (
    <>
      <h5
        className={style.h5}
        style={{
          fontWeight: bold && 600,
          fontStyle: italic && "italic",
          textDecoration: underline && "underline",
          textDecorationLine: strikeThrough && "line-through",
        }}
      >
        {children}
      </h5>
    </>
  );
};

export default Heading5;
