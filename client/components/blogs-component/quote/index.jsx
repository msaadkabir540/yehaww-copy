import React from "react";
import style from "./quote.module.scss";

const Quote = ({ children }) => {
  return (
    <>
      <div className={style.quote}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path d="M7 3.5H16.95V13.46L12.96 21.44H8L11.97 13.46H7V3.5Z" fill="#A8A9AD" />
        </svg>
        <p>{children}</p>
      </div>
    </>
  );
};

export default Quote;
