import { GET_ALL_VIDEOS } from "utils/endpoints";
import { apiRequest } from "utils/helper";

export const getAllVideos = async ({ setIsLoading, setVideos, setCount, params }) => {
  const res = await apiRequest({ type: "get", path: GET_ALL_VIDEOS, params });
  if (res.status === 200) {
    const { videos, count } = res.data;
    setVideos(videos);
    setCount(count);
    setIsLoading(false);
  }
  setIsLoading(false);
};
