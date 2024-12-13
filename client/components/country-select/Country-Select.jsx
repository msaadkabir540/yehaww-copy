import Image from "next/image";
import React from "react";

import Select from "react-select";

import style from "./index.module.scss";

export const CountrySelect = ({
  name,
  star,
  label,
  watch,
  options,
  setValue,
  onChange,
  className,
  clearErrors,
  errorMessage,
}) => (
  <>
    <label className={style.label}>
      {label} {star && star}
    </label>
    <Select
      options={options}
      name={name}
      label={label}
      value={options.find((x) => x.value === watch?.(name))}
      placeholder={label}
      onChange={(e) => {
        clearErrors(name);
        setValue(name, e.value);
      }}
      formatOptionLabel={({ color, label, image }) => {
        return (
          <div className={style.cOption}>
            {image && <Image src={image} alt={`${label}-flag`} width={30} height={20} />}
            <span style={{ color }}>{label}</span>
          </div>
        );
      }}
      isSearchable={true}
      styles={{
        ...style,
        control: (base, state) => ({
          ...base,
          height: "43px",
          marginTop: "5px",
          backgroundColor: "transparent",
          border: "1px solid #C0C0C0",
          boxShadow: "none",
          "&:hover": {
            outline: 0,
          },
        }),
        placeholder: (styles) => ({
          ...styles,
          fontSize: "13px",
          color: "#111112",
        }),
      }}
    />
    {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
  </>
);
