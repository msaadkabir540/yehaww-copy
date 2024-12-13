import React, { useState } from "react";
import Image from "next/image";
import { Controller } from "react-hook-form";
import ReactDatePicker from "react-datepicker";

import dateIcon from "public/assets/imgs/date-icon.svg";
import style from "./datepicker.module.scss";

const DatePicker = ({
  name,
  control,
  label,
  star,
  className,
  id,
  errorMessage,
  value,
  defaultVal,
  maxDate,
  disabled,
  minDate,
  iconClass,
}) => {
  return (
    <div className={`${style.main} ${className}`}>
      {label && (
        <label>
          {label} {star && star}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultVal || null}
        render={({ field }) => (
          <ReactDatePicker
            onChange={(date) => field.onChange(date === null ? "" : date)}
            selected={field.value}
            value={value}
            disabled={disabled}
            dateFormat={"dd/MM/yyyy"}
            maxDate={maxDate && maxDate}
            minDate={minDate && minDate}
            placeholderText={"dd/mm/yyyy"}
            className={`${style.inpDiv} ${errorMessage && style.borderClass}`}
            id={id}
          />
        )}
      />
      <label htmlFor={id}>
        <div className={`${style.icon} ${iconClass}`}>
          <div className={style.img}>
            <Image src={dateIcon} height={20} width={20} alt="dateIcon" />
          </div>
        </div>
      </label>
      {errorMessage ? <span className={style.errorMessage}>{errorMessage}</span> : ""}
    </div>
  );
};

export default DatePicker;
