import Link from "next/link";
import { useRef, useState } from "react";

import { useOutsideClickHook } from "utils/useOutsideClickHook";

import StayClean from "./stay-clean";
import HandsOn from "./hands-on";
import style from "./browse-popup.module.scss";

const BrowseYeehaw = ({ setBrowse }) => {
  const [active, setActive] = useState(0);

  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setBrowse(false);
  });

  return (
    <>
      <div className={style.candidate_popup_mainInner} ref={wrapperRef}>
        <h5>Browse Yehaww</h5>
        <div className={style.tabDiv}>
          <p
            onClick={() => setActive(0)}
            style={{
              border: active === 0 ? "1px solid  #B29E85" : "1px solid transparent",
              color: active === 0 ? " #B29E85" : "#C0C0C0",
            }}
          >
            Hands on
          </p>
          <p
            onClick={() => setActive(1)}
            style={{
              border: active === 1 ? "1px solid  #B29E85" : "1px solid transparent",
              color: active === 1 ? " #B29E85" : "#C0C0C0",
            }}
          >
            Stay clean
          </p>
        </div>
        {active === 0 && <HandsOn setBrowse={setBrowse} />}
        {active === 1 && <StayClean setBrowse={setBrowse} />}
      </div>
    </>
  );
};

export default BrowseYeehaw;
