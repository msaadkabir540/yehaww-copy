import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getAllVideos } from "api-services/videos";

const useVideo = () => {
  const pageSize = 10;
  const { token } = useSelector((state) => state.app);

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoLink, setVideoLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState({ position: "", sort: "Newest" });

  useEffect(() => {
    getAllVideos({ setIsLoading, setVideos, setCount, params: { ...params, page, pageSize } });
  }, [params]);

  return {
    count,
    token,
    videos,
    setPage,
    pageSize,
    setParams,
    isLoading,
    videoLink,
    setVideoLink,
  };
};

export default useVideo;
