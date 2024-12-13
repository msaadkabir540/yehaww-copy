import Loading from "components/loading";
import BlogCard from "components/blog-card";

import { useNews } from "./helper";

import style from "./articles.module.scss";

const AllArticlesPage = () => {
  const { loading, allPosts } = useNews();
  return (
    <>
      {loading ? (
        <div className={style.loader}>
          <Loading />
        </div>
      ) : (
        <div className={style.mainHeader}>
          <div className={style.grid}>
            {allPosts?.map((ele, index) => (
              <BlogCard
                key={index}
                id={ele?.key}
                date={ele?.date}
                heading={ele?.title}
                para={ele?.description}
                img={ele?.featuredImage}
                imgDetails={ele?.imgDetails}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AllArticlesPage;
