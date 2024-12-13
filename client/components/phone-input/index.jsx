import React from "react";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";

import style from "./phone-input.module.scss";
import "react-phone-input-2/lib/style.css";

const PhonePicker = ({
  label,
  control,
  name,
  className,
  id,
  errorMessage,
  ref,
  defaultVal,
  star,
}) => {
  return (
    <div className={`${style.main} ${className}`}>
      {label && (
        <label className={style.label}>
          {label} {star && star}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultVal || ""}
        render={({ field }) => (
          <PhoneInput
            buttonClass={style.flagWrapper}
            inputClass={style.phoneInput}
            containerClass={style.container}
            countryCodeEditable={false}
            onChange={(value, country) => {
              field.onChange(value === country.dialCode ? "" : value);
            }}
            value={field.value}
            name={field.name}
            inputStyle={{
              border: errorMessage ? "1px solid #ff5050" : "1px solid #C0C0C0",
              height: "43px",
              borderLeft: "none",
            }}
            buttonStyle={{
              border: errorMessage ? "1px solid #ff5050" : "1px solid #C0C0C0",
            }}
          />
        )}
      />
      {errorMessage ? <span className={style.errorMessage}>{errorMessage}</span> : ""}
    </div>
  );
};

export default PhonePicker;
