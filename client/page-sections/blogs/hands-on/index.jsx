import React from "react";

import Loading from "components/loading";
import BlogCard from "components/blog-card";

import user from "public/assets/user.svg";
import horseImg1 from "public/assets/horse-blog.svg";

import { useNews } from "../all-articles/helper";

import style from "./jobs.module.scss";

const HandsOnPage = () => {
  const { loading, handsOnPosts } = useNews();

  return (
    <div>
      {loading ? (
        <div className={style.loader}>
          <Loading />
        </div>
      ) : (
        <div className={style.grid}>
          {handsOnPosts?.map((ele, index) => (
            <BlogCard
              key={index}
              id={ele?.id}
              img={ele.blogImg}
              heading={ele.title}
              para={ele.description}
              imgDetails={ele?.blogImgDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HandsOnPage;
