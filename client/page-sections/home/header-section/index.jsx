/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Link from "next/link";

import TabsSection from "./tabs-section";

import style from "./header.module.scss";

const HeaderSection = () => {
  const [active, setActive] = useState(0);

  return (
    <div className={style.HeaderSection}>
      <div className={style.headerTop}>
        <h5>{active === 0 ? "We connect talent" : "We connect talent"}</h5>
        <p>
          {active === 0
            ? "Yehaww was created as a way to connect equestrians all over the world. The site is a first of its kind in the industry and the idea is to have a database with all the members of the equine community in one place.  "
            : "Yehaww was created as a way to connect equestrians all over the world. The site is a first of its kind in the industry and the idea is to have a database with all the members of the equine community in one place.  "}
          {!(typeof window !== "undefined" && window.localStorage.getItem("token")) && (
            <Link href={active === 0 ? "/sign-up" : "/sign-up"}>
              <span>{active === 0 ? "Free Sign Up" : "Free Sign Up"}</span>
            </Link>
          )}
        </p>
      </div>
      <div className={style.headerBottom}>
        <TabsSection active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default HeaderSection;
