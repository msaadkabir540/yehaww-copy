import React, { useState } from "react";

import style from "./tab.module.scss";

const Tabs = ({ title, star, name, setValue, errorMessage, duration }) => {
  const [selectedBtn, setSelectedBtn] = useState();

  return (
    <div style={{ position: "relative" }}>
      <div
        className={style.container}
        style={{ border: errorMessage ? "1px solid #ff5050" : "1px solid #ebebeb" }}
      >
        {title && (
          <p>
            {title} {star && star}
          </p>
        )}
        <div className={style.main}>
          {btn?.map(({ text }, index) => {
            return (
              <span
                key={index}
                className={`${style.btn} ${
                  (selectedBtn || duration) === text ? style.selected : ""
                }`}
                onClick={() => {
                  setSelectedBtn(text);
                  setValue && setValue(name, text);
                }}
              >
                {text
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            );
          })}
        </div>
      </div>
      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </div>
  );
};

export default Tabs;

const btn = [
  { index: "1", text: "0 - 6 months" },
  { index: "2", text: "0.5 - 1 year" },
  { index: "3", text: "1 - 2 years" },
  { index: "4", text: "2 - 5 years" },
  { index: "5", text: "5+ years" },
  { index: "6", text: "10+ years" },
];
