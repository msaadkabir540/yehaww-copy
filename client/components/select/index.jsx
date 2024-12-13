import Image from "next/image";

import arrow from "public/assets/arrowdown.svg";

import style from "./select.module.scss";

const Select = ({
  name,
  star,
  value,
  label,
  disable,
  onChange,
  children,
  register,
  className,
  errorClass,
  selectClass,
  errorMessage,
  defaultValue,
}) => {
  return (
    <div style={{ position: "relative" }} className={className}>
      {label && (
        <label className={style.label}>
          {label} {star && star}
        </label>
      )}
      <div className={style.selectDiv}>
        <select
          name={name}
          value={value}
          placeholder={"pkj"}
          {...(onChange && { onChange })}
          {...(defaultValue && { defaultValue })}
          {...(register &&
            register(name, {
              onChange,
            }))}
          className={`${style.select} ${selectClass}`}
          style={{
            border: errorMessage ? "1px solid #ff5050" : "1px solid #c0c0c0",
          }}
          disabled={disable || false}
        >
          {children}
        </select>
        <div className={style.icon}>
          <Image height={8} width={13} src={arrow} alt="arrow_icon" />
        </div>
      </div>
      {errorMessage && (
        <span className={`${style.errorMessage} ${errorClass}`}>{errorMessage}</span>
      )}
    </div>
  );
};

export default Select;
