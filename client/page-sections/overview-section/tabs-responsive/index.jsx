import Link from "next/link";
import { useRef } from "react";
import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./popup.module.scss";

const ResponsiveTabsPopUp = ({ setPopUpJob, navLinksArr, pathname }) => {
  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setPopUpJob(false);
  });

  return (
    <>
      <div className={style.mainInner} ref={wrapperRef}>
        <ul className={style.navMenuWrapper}>
          {navLinksArr.map(
            ({ path, title, show }) =>
              show && (
                <li key={title}>
                  <Link href={path}>
                    <p
                      style={{
                        color: pathname === path ? "#b29e85" : "#c0c0c0",
                      }}
                    >
                      {title}
                    </p>
                  </Link>
                </li>
              )
          )}
        </ul>
      </div>
    </>
  );
};

export default ResponsiveTabsPopUp;
