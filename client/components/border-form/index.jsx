import React from "react";

import Button from "components/button";

import style from "./form.module.scss";

const BorderForm = ({
  title,
  btnDiv,
  button,
  btnClass,
  children,
  className,
  backStyle,
  titleClass,
  handleClick,
}) => {
  return (
    <div className={`${style.basicWrapper} ${className}`} style={backStyle}>
      <div className={btnDiv}>
        {title && <p className={`${style.form_title} ${titleClass ? titleClass : ""}`}>{title}</p>}
        {button && (
          <Button className={btnClass} title="+ Add Experience" handleClick={handleClick} />
        )}
      </div>
      {children}
    </div>
  );
};

export default BorderForm;
