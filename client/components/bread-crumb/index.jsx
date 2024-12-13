import React from "react";
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/router";

import arrow from "public/assets/arrow-left.svg";
import style from "./breadcrumb.module.scss";

const BreadCrumb = ({ containerClass, className, data }) => {
  const { pathname } = useRouter();
  return (
    <div className={`${style.headingDiv} ${className}`}>
      <div className={containerClass}>
        <h1>
          <Link href={data[0].path}>
            <a>
              <span>{data[0].title}</span>
            </a>
          </Link>
          {data.map(({ path, title }, index) => (
            <React.Fragment key={index}>
              {pathname === path && index !== 0 && (
                <>
                  <div className={style.arrow_icon}>
                    <Image src={arrow} width={24} height={24} alt="check-icon" />
                  </div>
                  {title}
                </>
              )}
            </React.Fragment>
          ))}
        </h1>
      </div>
    </div>
  );
};

export default BreadCrumb;
