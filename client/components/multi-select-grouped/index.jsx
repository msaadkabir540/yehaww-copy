import SearchSelect from "react-select";

import style from "./multi-select.module.scss";

const MultiSelectGrouped = ({
  name,
  star,
  label,
  value,
  watch,
  options,
  setValue,
  onChange,
  clearErrors,
  placeholder,
  errorMessage,
  customStyle,
  isMulti = true,
}) => {
  return (
    <>
      <label className={style.label}>
        {label} {star && star}
      </label>
      <SearchSelect
        styles={{
          ...style,
          control: (base, state) => ({
            height: "43px",
            ...base,
            ...customStyle,
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              outline: state.isFocused ? 0 : 0,
            },
          }),
          placeholder: (styles) => ({
            ...styles,
            fontSize: "13px",
            color: "#111112",
          }),
        }}
        className={style.control}
        name={name}
        value={
          value || (watch?.(name) && isMulti)
            ? watch?.(name)?.map((x) => ({
                value: x,
                label: x,
              }))
            : watch?.(name)
            ? { value: watch?.(name), label: watch?.(name) }
            : ""
        }
        label={label}
        placeholder={placeholder}
        options={options}
        formatGroupLabel={({ label }) => {
          return (
            <div className={style.cOption}>
              <h4 style={{ fontWeight: "800", fontSize: "16px" }}>{label}</h4>
            </div>
          );
        }}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          } else {
            setValue(name, [...e.map((ele) => ele.value)]);
            clearErrors(name);
          }
        }}
        isSearchable={true}
        isMulti={isMulti}
      />
      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </>
  );
};

export default MultiSelectGrouped;
