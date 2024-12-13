import axios from "axios";
import { COOKIES_ROUTE, PRIVACY_POLICY_ROUTE, TERMS_CONDITION_ROUTE } from "utils/endpoints";
import { apiRequest } from "utils/helper";

export const getCookiesData = async ({ setLoader, setData }) => {
  setLoader(true);
  const res = await apiRequest({
    type: "get",
    path: COOKIES_ROUTE,
  });
  if (res.status === 200) {
    setData(res.data.content);
  }
  setLoader(false);
};

export const getPrivacyPolicyData = async ({ setLoader, setData }) => {
  setLoader(true);
  const res = await apiRequest({
    type: "get",
    path: PRIVACY_POLICY_ROUTE,
  });
  if (res.status === 200) {
    setData(res.data.content);
  }
  setLoader(false);
};

export const getTermsConditionData = async ({ setLoader, setData }) => {
  setLoader(true);
  const res = await apiRequest({
    type: "get",
    path: TERMS_CONDITION_ROUTE,
  });
  if (res.status === 200) {
    setData(res.data.content);
  }
  setLoader(false);
};

export const getNewsData = async ({ setLoading, setPosts, newsQuery }) => {
  try {
    const res = await axios({
      url: newsQuery,
      method: "get",
    });
    if (res.status === 200) {
      setPosts(res?.data?.data?.posts?.edges);
    }
  } catch (err) {
    console.error(err);
  }
  setLoading(false);
};

export const getNewsBlogs = async ({ setLoading, setPosts }) => {
  try {
    const forProduction = process.env.NODE_ENV !== "development";
    const res = await axios({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_BLOG_WEBSITE_URL}/api/news-blogs`,
      params: { "populate[0]": "image", "filters[forProduction][$eq]": forProduction },
    });
    if (res.status === 200) {
      const blogs = res?.data?.data?.map((blog) => {
        const blogImg = blog?.attributes?.image?.data?.attributes?.url;
        return {
          id: blog?.id,
          key: blog?.attributes?.key,
          title: blog?.attributes?.title,
          date: blog?.attributes?.createdAt,
          description: blog?.attributes?.description,
          featuredImage: `${process.env.NEXT_PUBLIC_BLOG_WEBSITE_URL}${blogImg}`,
          imgDetails: {
            width: blog?.attributes?.image?.data?.attributes?.width,
            height: blog?.attributes?.image?.data?.attributes?.height,
          },
          metaData: blog?.attributes?.metaData,
        };
      });

      setPosts(blogs);
    }
  } catch (err) {
    console.error(err);
  }
  setLoading(false);
};
