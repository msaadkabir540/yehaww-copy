import { useEffect, useRef, useState } from "react";
import Input from "components/input";
import style from "./search-select.module.scss";
import { useOutsideClickHook } from "utils/useOutsideClickHook";

const SearchSelect = ({
  label,
  placeholder,
  className,
  options,
  name,
  setValue,
  clearErrors,
  defaultValue,
  autocomplete,
  dashboard = false,
  errorMessage,
  disableSplit = false,
}) => {
  const wrapperRef = useRef();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(options);
  const [selectValue, setSelectValue] = useState(defaultValue || "");

  useOutsideClickHook(wrapperRef, () => {
    setTimeout(() => {
      setOpen(false);
    }, 500);
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSelectValue(value);
    if (value === "") {
      setValue(name, "");
      setOpen(false);
    } else {
      setOpen(true);
      setList(options?.filter((ele) => ele.toLowerCase().includes(value.toLowerCase())));
    }
  };

  useEffect(() => {
    setSelectValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className={style.searchSelect}>
      <Input
        star="*"
        label={label}
        placeholder={placeholder}
        autocomplete={autocomplete}
        value={
          selectValue?.length
            ? disableSplit
              ? selectValue
              : selectValue?.split?.("-")?.[0].replace("+", "") || ""
            : ""
        }
        type="text"
        onChange={(e) => handleSearch(e)}
        onClick={() => setOpen(!open)}
        className={`${style.field} ${className}`}
        inputClass={className}
        errorMessage={errorMessage}
      />
      {open && (
        <div className={style.searchDropdown}>
          {list?.length > 0 ? (
            list?.map((ele, index) => (
              <div className={style.innerDiv} key={index} ref={wrapperRef}>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const value = disableSplit ? list[index] : list[index].split("-")[0];

                    if (dashboard && value.includes("+")) {
                      return;
                    } else {
                      setOpen(false);
                      clearErrors && clearErrors(name);
                      setValue(name, value);
                      setSelectValue(value);
                    }
                  }}
                >
                  {disableSplit ? ele : `${ele.split("-")[0].replace("+", "")}`}
                </p>
              </div>
            ))
          ) : (
            <label className={style.noDataFound}>No {placeholder} found</label>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
