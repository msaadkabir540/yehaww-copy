import style from "./checkbox.module.scss";

const Checkbox = ({
  id,
  htmlFor,
  label,
  handleChange,
  register,
  star,
  name,
  checked,
  errorMessage,
  value,
}) => {
  return (
    <div>
      <div>
        <label className={style.container} htmlFor={htmlFor}>
          <p>
            {label} {star && star}
          </p>
          <input
            type="checkbox"
            name={name}
            {...(value ? { value } : {})}
            id={id}
            onClick={handleChange}
            checked={checked}
            {...(register && register(name))}
          />
          <span
            className={style.checkMark}
            style={{ border: errorMessage && "1px solid #ff5050" }}
          ></span>
        </label>
      </div>
      {/* {errorMessage && <p>{errorMessage}</p>} */}
    </div>
  );
};

export default Checkbox;
