import React, { useState } from "react";

import StayClean from "./stay-clean";
import HandsOn from "./hands-on";

import style from "./browse.module.scss";

const BrowseYehaww = () => {
  const [active, setActive] = useState(0);

  return (
    <div className={style.main}>
      <h5>Browse Yehaww</h5>
      <div className={style.tabDiv}>
        <p
          onClick={() => setActive(0)}
          style={{
            borderBottom: active === 0 ? "3px solid #5d77a0" : "3px solid transparent",
            color: active === 0 ? "#5d77a0" : "",
          }}
        >
          Hands on
        </p>
        <p
          onClick={() => setActive(1)}
          style={{
            borderBottom: active === 1 ? "3px solid #5d77a0" : "3px solid transparent",
            color: active === 1 ? "#5d77a0" : "",
          }}
        >
          Stay clean
        </p>
      </div>
      {active === 0 && <HandsOn />}
      {active === 1 && <StayClean />}
    </div>
  );
};

export default BrowseYehaww;
