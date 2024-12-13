import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getNewsBlogs } from "api-services/general-pages";

export const useNews = () => {
  const [post, setPost] = useState({});
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyPosts, setCompanyPosts] = useState([]);
  const [handsOnPosts, setHandsOnPosts] = useState([]);

  const router = useRouter();

  useEffect(() => {
    getNewsBlogs({ setLoading, setPosts });
  }, []);

  useEffect(() => {
    const queryPost = posts?.find((post) => post?.key === router?.query?.id);
    setPost(queryPost);
    setJobPosts(posts);
    setAllPosts(posts);
    setCompanyPosts(posts);
    setHandsOnPosts(posts);
  }, [router, posts]);

  return {
    post,
    loading,
    jobPosts,
    allPosts,
    companyPosts,
    handsOnPosts,
  };
};
