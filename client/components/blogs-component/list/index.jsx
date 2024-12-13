import React from "react";

import style from "./list.module.scss";

const ListComponent = ({ children }) => {
  return (
    <>
      <ul className={style.ul}>
        <li>{children}</li>
      </ul>
    </>
  );
};

export default ListComponent;
