import React from "react";

import { useRef } from "react";
import Link from "next/link";

import { useOutsideClickHook } from "utils/useOutsideClickHook";
import style from "./navbar.module.scss";

const SidebarPopup = ({ navLink, setOpenSidebar, user, navActive, path }) => {
  const wrapperRef = useRef(null);

  useOutsideClickHook(wrapperRef, () => {
    setOpenSidebar(false);
  });

  return (
    <div className={style.mainNavSmall} ref={wrapperRef}>
      {" "}
      {navLink.map(({ path, name, click, pathMatch }, index) => {
        return (
          <React.Fragment key={index}>
            {(user?.type === "candidate" && path === "/jobs") ||
            (user?.type === "employer" && path === "/find-candidate") ||
            path === "/more" ||
            (path === "/position" && isWindowDefined()) ? (
              <>
                <li className={navActive(pathMatch)} onClick={click}>
                  {name}
                </li>
              </>
            ) : (
              <Link href={path}>
                <a className={navActive(pathMatch)}>{name}</a>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SidebarPopup;
