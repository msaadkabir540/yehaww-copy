import React from "react";
import Image from "next/image";

import leftArrow from "public/assets/left.svg";
import rightArrow from "public/assets/right.svg";
import style from "./pagination.module.scss";

const Pagination = ({ count, page, pageSize, setPage, onChange }) => {
  page = parseInt(page);
  const totalPages = Math.ceil(count / pageSize);
  const pages = Array.from({ length: totalPages }, (v, k) => k + 1).slice(
    page > 5 ? page - 4 : 0,
    page + 5
  );

  return (
    <div className={style.pagination_wrapper}>
      <ul>
        <li
          onClick={() => {
            page > 0 && setPage(page - 1);
            onChange && onChange(page - 1);
          }}
        >
          <Image height={17} width={10} src={leftArrow} alt="leftArrow" />
        </li>
        {pages.map((x, index) => (
          <li
            key={index}
            className={page === x - 1 ? style.active : ""}
            onClick={() => {
              setPage(x - 1);
              onChange && onChange(x - 1);
            }}
          >
            {x}
          </li>
        ))}
        <li
          className={page >= totalPages - 1 ? style.disabled : ""}
          onClick={() => {
            page < totalPages - 1 && setPage(page + 1);
            onChange && onChange(page + 1);
          }}
        >
          <Image height={17} width={10} src={rightArrow} alt="rightArrow" />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
