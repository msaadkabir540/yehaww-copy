import React, { memo } from "react";
import moment from "moment";
import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/router";

import Loading from "components/loading";
import BlockRender from "../block-render";
import BlogCard from "components/blog-card";
import BorderForm from "components/border-form";
import createNotification from "common/create-notification";

import { useOutsideClickHook } from "utils/useOutsideClickHook";
import { useNews } from "page-sections/blogs/all-articles/helper";

import user from "public/assets/user.svg";
import fb from "public/assets/blog-fb.svg";
import linkIcon from "public/assets/blog-link.svg";
import horseImg1 from "public/assets/horse-blog.svg";
import linkdln from "public/assets/blog-linkdln.svg";
import twitter from "public/assets/blog-twitter.svg";

import style from "./inner.module.scss";

const InnerBlogSection = () => {
  const { loading, allPosts, post } = useNews();
  const wrapperRef = useRef(null);
  const router = useRouter();
  const currentURL = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;

  useOutsideClickHook(wrapperRef, () => {
    setShareLink(false);
  });

  return (
    <>
      {loading ? (
        <div className={style.loader}>
          <Loading />
        </div>
      ) : (
        <div className={style.main}>
          <BorderForm title={post?.title}>
            <div
              className={style.flex}
              style={{
                gap: "13px",
                marginTop: "24px",
              }}
            >
              <p>{moment(post?.date).format("MMM DD, YYYY")}</p>
            </div>
            <div className={style.flexMain}>
              <div className={style.imgSection}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigator.clipboard.writeText(currentURL);
                    createNotification("success", "Link Copied");
                  }}
                >
                  <Image src={linkIcon} width={41} height={41} />
                </div>

                {/* Tweeter Link */}
                <a
                  target="_blank"
                  href={`https://twitter.com/intent/tweet?url=${process.env.NEXT_PUBLIC_BASE_URL}/news/inner-news/${post?.id}&text=
                  {${post?.title}} `}
                >
                  <Image src={twitter} width={41} height={41} />
                </a>

                {/* LinkedIn Link */}
                <a
                  target="_blank"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_BASE_URL}/news/inner-news/${post?.id}`}
                >
                  <Image src={linkdln} width={41} height={41} />
                </a>

                {/* Facebook Link */}
                <a
                  target="_blank"
                  href={`https://www.facebook.com/dialog/share?app_id${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&display=popup&href=${process.env.NEXT_PUBLIC_BASE_URL}/news/inner-news/${post?.id}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/news/inner-news/${post?.id}`}
                >
                  <Image src={fb} width={41} height={41} />
                </a>
              </div>
              <div className={style.rightDiv}>
                <h1>{post?.title}</h1>
                <div className={style.img}>
                  {post?.featuredImage && (
                    <Image
                      src={post?.featuredImage}
                      width={post?.imgDetails?.width}
                      height={post?.imgDetails?.height}
                    />
                  )}
                </div>
                <p className={style.p} style={{ fontSize: "16px" }}>
                  {post?.description}
                </p>

                <div className={style.content}>
                  <BlockRender content={post?.metaData} />
                </div>
              </div>
            </div>
          </BorderForm>
          {/* <BorderForm title={"Home Groom/Flat Rider (Showjumping)"}>
        //     <span className={style.span}>
        //       lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
        //       has been the industry's{" "}
        //     </span>
        //     <p
        //       className={style.p}
        //       style={{
        //         fontSize: "21px",
        //       }}
            >
              Sorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
              dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
              sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum
              velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac
              scelerisque ante pulvinar
            </p>
            <h5>Horse Health:</h5>
            <ul>
              <li>lorem Ipsum is simply dummy text of the printing and typesetting industry</li>
              <li> Trust and safety: the cornerstones of Healthcare AI</li>
              <li>Real-world impact on primary care today</li>
              <li>
                {" "}
                Our commitment to making healthcare more accessible, accurate, and convenient
              </li>
            </ul>
            <h5>Lorem Ipsum is simply dummy text of the printing & typesetting</h5>
            <p className={style.p}>
              Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
              dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
              sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum
              velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac
              scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor
              urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
              Aliquam in elementum tellus.
            </p>
            <p className={style.p}>
              Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
              dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
              sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum
              velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac
              scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor
              urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
              Aliquam in elementum tellus.
            </p>
            <p className={style.p}>
              Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
              dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
              sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum
              velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac
              scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor
              urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
              Aliquam in elementum tellus.
            </p>
            <h5>Lorem Ipsum is simply dummy text of the printing & typesetting</h5>
            <p className={style.p}>
              Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
              dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
              sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum
              velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac
              scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor
              urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
              Aliquam in elementum tellus.
            </p>
            <p className={style.p}>
              Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
              dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
              sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum
              velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac
              scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor
              urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
              Aliquam in elementum tellus.
            </p>
            <p className={style.p}>
              Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
              dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
              sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum
              velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac
              scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor
              urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
              Aliquam in elementum tellus.
            </p>
            <div className={style.userFlex}>
              <Image src={user} height={111} width={111} />
              <div>
                <p className={style.title}>Mili Jones</p>
                <p className={style.name}>VP of Artificial Intelligence</p>
                <p className={style.para}>
                  Porem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
                  dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </BorderForm> */}
          <div className={style.outerFlex}>
            <h2>Enjoyed this article? Try another!</h2>
            <div className={style.grid}>
              {allPosts
                ?.filter((ele) => ele?.id !== post?.id)
                ?.slice(0, 3)
                ?.map((ele, index) => (
                  <BlogCard
                    key={index}
                    id={ele?.key}
                    heading={ele.title}
                    para={ele.description}
                    img={ele.featuredImage}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(InnerBlogSection);
