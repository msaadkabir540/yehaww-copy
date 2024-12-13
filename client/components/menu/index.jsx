import { useRef } from "react";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./menu.module.scss";

const MenuPopUp = ({ setMenuPopUp, options }) => {
  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setTimeout(() => {
      setMenuPopUp(false);
    }, 250);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        {options?.map((option) => (
          <p onClick={option?.click}>{option?.text}</p>
        ))}
      </div>
    </>
  );
};

export default MenuPopUp;
