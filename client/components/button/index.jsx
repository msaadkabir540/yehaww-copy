/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Loading from "components/loading";

import arrow from "public/assets/arrow-left.svg";

import style from "./button.module.scss";

const Button = ({
  form,
  type,
  icon,
  title,
  styles,
  btnName,
  disabled,
  isLoading,
  className,
  iconStart,
  handleClick,
  loaderClass,
}) => {
  return (
    <>
      <button
        className={`${style.btn} ${className}`}
        onClick={(e) => {
          e.nativeEvent.stopPropagation();
          handleClick && handleClick(e);
        }}
        type={type}
        form={form && form}
        name={btnName && btnName}
        disabled={disabled || isLoading || false}
        style={{
          pointerEvents: isLoading || disabled ? "none" : "auto",
          ...styles,
        }}
      >
        {iconStart && (
          <div className={style.arrow_icon_start}>
            <Image src={iconStart} alt={"button icon"} width={24} height={24} />
          </div>
        )}
        {isLoading ? <Loading loaderClass={`${style.loaderClass} ${loaderClass}`} /> : title}
        {icon && (
          <div className={style.arrow_icon} style={{ height: "24px" }}>
            <Image src={icon} alt={"button icon"} width={24} height={24} />
          </div>
        )}
      </button>
    </>
  );
};

export default Button;
