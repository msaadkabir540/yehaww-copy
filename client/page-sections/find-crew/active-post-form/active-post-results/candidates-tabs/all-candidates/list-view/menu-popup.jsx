import Link from "next/link";
import { useState } from "react";
import { useRef } from "react";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./list.module.scss";

const MenuPopUp = ({ setMenuPopUp, data }) => {
  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setMenuPopUp(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <a href={`tel:${data?.phoneNumber}`}>
          <p
            onClick={(e) => {
              e.stopPropagation();
              setMenuPopUp(false);
            }}
            className={style.borderClass}
          >
            Call
          </p>
        </a>
        <a
          href={`https://wa.me/${data?.phoneNumber}?text=Hi,%20${data?.name}`}
          className={style.whatsapp}
          target="_blank"
        >
          <p
            onClick={(e) => {
              e.stopPropagation();
              setMenuPopUp(false);
            }}
            className={style.borderClass}
          >
            Whatsapp (Mobile Only)
          </p>
        </a>
      </div>
    </>
  );
};

export default MenuPopUp;
