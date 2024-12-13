import { useState } from "react";

const useBlogs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const nav_links = [{ title: "News", path: "/news", show: false }];

  return {
    isLoading,
    nav_links,
  };
};
export default useBlogs;
