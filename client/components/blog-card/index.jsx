import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import demo from "public/assets/imgs/demo-news.png";
import arrow1 from "public/assets/blog-arrow-brown.svg";

import style from "./blog.module.scss";

const BlogCard = ({ id, img, imgDetails, heading, para }) => {
  const image = useMemo(() => {
    return img;
  }, [img]);
  return (
    <div className={style.card}>
      <div className={style.img}>
        <Link href={`/news/inner-news/${id}`}>
          <div className={style.img}>
            <div className={style.blogImg}>
              <Image
                priority
                alt="blog-card"
                src={image || demo}
                width={imgDetails?.width || 690}
                height={imgDetails?.height || 325}
              />
            </div>
          </div>
        </Link>
      </div>
      <Link href={`/news/inner-news/${id}`}>
        <h6>{heading}</h6>
      </Link>
      <div className={style.description}>
        <p className={style.p}>{para}</p>
        <Link href={`/news/inner-news/${id}`}>
          <div className={style.seeAll}>
            <p>See More</p>
            <Image src={arrow1} Width={10} height={15} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
