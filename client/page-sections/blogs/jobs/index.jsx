import React from "react";

import Loading from "components/loading";
import BlogCard from "components/blog-card";

import { useNews } from "../all-articles/helper";

import user from "public/assets/user.svg";
import horseImg1 from "public/assets/horse-blog.svg";

import style from "./jobs.module.scss";

const JobsPage = () => {
  const { loading, jobPosts } = useNews();

  return (
    <div>
      {loading ? (
        <div className={style.loader}>
          <Loading />
        </div>
      ) : (
        <div className={style.grid}>
          {jobPosts?.map((post, index) => (
            <BlogCard
              key={index}
              id={post.id}
              img={post.blogImg}
              heading={post.title}
              para={post.description}
              imgDetails={post?.blogImgDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
