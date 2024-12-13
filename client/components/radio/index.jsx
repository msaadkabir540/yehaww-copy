import style from "./radio.module.scss";

const Radio = ({
  label,
  id,
  handleClick,
  name,
  handleChange,
  checked,
  radioRef,
  radioValue,
  error,
  className,
  defaultChecked,
}) => {
  return (
    <div>
      <label
        className={`${style.container} ${className}`}
        htmlFor={id}
        style={{
          fontSize: "16px",
        }}
      >
        {label}
        <input
          type="radio"
          name={name}
          id={id}
          onClick={handleClick}
          onChange={handleChange}
          checked={checked}
          ref={radioRef}
          value={radioValue}
          defaultChecked={defaultChecked}
        />
        <span className={style.checkMark} style={{ borderColor: error ? "red" : "" }}></span>
      </label>
    </div>
  );
};

export default Radio;
