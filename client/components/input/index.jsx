/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import style from "./input.module.scss";

const Input = ({
  id,
  min,
  max,
  type,
  name,
  icon,
  star,
  label,
  value,
  accept,
  upIcon,
  onClick,
  readOnly,
  downIcon,
  infoText,
  register,
  onChange,
  isDisable,
  className,
  iconClass,
  errorClass,
  inputClass,
  placeholder,
  numbersOnly,
  autocomplete,
  errorMessage,
}) => {
  const handleKeyDown = (e) => {
    if (numbersOnly && e.key === "-") {
      e.preventDefault();
    }
  };

  const handleUpIconClick = () => {};

  const handleDownIconClick = () => {};

  return (
    <>
      <div className={`${style.inputContainer} ${className}`}>
        {label && (
          <label>
            {label} {star && star}
          </label>
        )}
        <div style={{ position: "relative" }}>
          <input
            id={id || ""}
            min={min && min}
            max={max && max}
            name={name || ""}
            type={type || "text"}
            className={inputClass}
            value={value && value}
            accept={accept && accept}
            readOnly={readOnly || false}
            disabled={isDisable || false}
            placeholder={placeholder || ""}
            onChange={onChange && onChange}
            onWheel={(e) => e.target.blur()}
            {...(register && register(name))}
            onKeyDown={numbersOnly && handleKeyDown}
            autoComplete={autocomplete && autocomplete}
            style={{
              border: errorMessage ? "1px solid #ff5050" : "1px solid #C0C0C0",
            }}
          />
          {icon && (
            <div className={`${style.icon} ${iconClass}`}>
              <Image
                src={icon}
                alt="icon"
                width={28}
                height={28}
                onClick={onClick}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
          {upIcon && (
            <div className={style.customIcon} style={{ height: "15px", width: "10px" }}>
              <Image
                src={upIcon}
                alt="Up Icon"
                width={12}
                height={12}
                onClick={handleUpIconClick}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
          {downIcon && (
            <div className={style.customIcon1} style={{ height: "15px", width: "10px" }}>
              <Image
                src={downIcon}
                alt="Down Icon"
                width={12}
                height={12}
                onClick={handleDownIconClick}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </div>
        {errorMessage ? (
          <span className={`${style.errorMessage} ${errorClass}`}>{errorMessage}</span>
        ) : (
          <span className={style.message}>{infoText}</span>
        )}
      </div>
    </>
  );
};

export default Input;
