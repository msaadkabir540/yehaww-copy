import Button from "components/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import style from "./table.module.scss";

const Table = ({
  columns,
  rows,
  minWidth,
  className,
  tableHeight,
  heading,
  tr,
  headingTitle,
  thead,
}) => {
  return (
    <>
      <div className={`${style.tableWrapper} ${tableHeight}`}>
        <div className={style.table}>
          <div className={`${style.thead} ${thead}`}>
            {columns?.map((column, index) => (
              <div
                key={index}
                className={`${style.heading} ${heading}`}
                style={{
                  minWidth: column?.width ? column?.width : "50px",
                  textAlign: column?.alignText ? column?.alignText : "center",
                }}
              >
                <p>
                  <span className={`${style.headingTitle} ${headingTitle}`}>{column.name}</span>
                </p>
              </div>
            ))}
          </div>

          {rows?.length > 0 ? (
            rows?.map((row, index) => (
              <div
                className={`${style.tr} ${tr}`}
                style={{ display: "flex", alignItems: "center" }}
                key={index}
              >
                {columns.map((column, colIndex) => (
                  <div
                    key={colIndex}
                    style={{
                      minWidth: column?.width ? column?.width : "250px",
                      padding: "8px",
                      width: "100%",
                    }}
                    className={`${style.td} ${className}  `}
                  >
                    {column.key !== "actions" ? (
                      <div>
                        {column.key !== "info" ? (
                          <p
                            style={{
                              textAlign: column?.alignText ? column?.alignText : "center",
                            }}
                          >
                            {textShow(row, column)}
                          </p>
                        ) : (
                          <div
                            style={{
                              textTransform: "lowercase",
                              display: "flex",
                              alignItems: "center",
                              fontWeight: "500",
                            }}
                          >
                            <Image
                              src={row.info.url}
                              style={{ borderRadius: "10px" }}
                              alt={"img"}
                              width={100}
                              height={100}
                            />
                            <p style={{ fontWeight: "500", padding: "0px 20px" }}>
                              {row.info.name}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={style.iconsDiv}>
                        <Link href="/sign-up">
                          <a style={{ margin: "4px" }}>
                            <Button title={"Sign Up"} className={style.btnSignUp} />
                          </a>
                        </Link>
                        <Link href="/u/[id]">
                          <a style={{ margin: "4px" }}>
                            <Button title={"View Profile"} className={style.btnViewProfile} />
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className={style.nodataDiv}>
              <h1 className={style.nodata}>No Data Found</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;

const textShow = (row, col) => {
  if (row[col.key]) {
    if (col?.formatter) {
      return col.formatter(row[col.key]);
    }
    return row[col.key];
  } else {
    return "--";
  }
};
