import SearchSelect from "react-select";

import style from "./multi-select.module.scss";

const MultiSelect = ({
  name,
  star,
  label,
  watch,
  options,
  setValue,
  onChange,
  clearErrors,
  errorMessage,
  customStyle,
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
            height: "max-content",
            minHeight: "43px",
            ...base,
            ...customStyle,
            backgroundColor: "transparent",
            boxShadow: "none",
            border: errorMessage ? "1px solid #ff5050" : "1px solid #c0c0c0",

            "&:hover": {
              outline: state.isFocused ? 0 : 0,
              border: state.isFocused && "1px solid  #C0C0C0",
            },
          }),
          placeholder: (styles) => ({
            ...styles,
            fontSize: "13px",
            color: "#111112",
          }),
        }}
        name={name}
        value={watch?.(name)?.map((x) => ({
          value: x,
          label: x,
        }))}
        label={label}
        placeholder={label}
        options={options?.map((x) => {
          return { value: x, label: x };
        })}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          } else {
            setValue(name, [...e.map((ele) => ele.value)]);
            clearErrors(name);
          }
        }}
        isSearchable={true}
        isMulti
      />
      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </>
  );
};

export default MultiSelect;
