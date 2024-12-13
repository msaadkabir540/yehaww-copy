import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { getAllVideos } from "api-services/videos";
import { newPositionArr1 } from "utils/arrayHelper";

const useVideo = () => {
  const pageSize = 10;
  const router = useRouter();
  const { setValue, watch, reset } = useForm({
    defaultValues: {
      position: "All",
      sort: "Newest",
    },
  });
  const { token, user } = useSelector((state) => state.app);

  const userType = useMemo(() => {
    return user?.type;
  }, [user]);

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoLink, setVideoLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [params, setParams] = useState({ position: "All", sort: "Newest" });

  useEffect(() => {
    const categories = newPositionArr1.filter((x) => x.includes("+"));
    const positions = newPositionArr1.filter((x) => !x.includes("+"));
    const groupedOptionsArr = [
      {
        options: [{ label: "All", value: "All" }],
      },
      ...categories.map((category) => {
        const currentCategory = category.replace("+", "");
        return {
          label: currentCategory,
          options: positions
            .filter((position) => position.includes(currentCategory))
            .map((x) => {
              const value = `${x.split("-")[0]} (${x.split("-")[1]})`;
              return { label: x.split("-")[0], value, value };
            }),
        };
      }),
    ];
    setGroupedOptions(groupedOptionsArr);
  }, []);

  useEffect(() => {
    router.push({
      pathname: "/videos",
      query: { page },
    });
  }, [page]);

  useEffect(() => {
    if (parseInt(router?.query?.page) > 0) setPage(parseInt(router?.query?.page));
  }, [router]);

  useEffect(() => {
    setIsLoading(true);
    getAllVideos({
      setIsLoading,
      setVideos,
      setCount,
      params: { ...params, page, pageSize },
    });
  }, [page]);

  const onSearch = () => {
    setIsLoading(true);
    getAllVideos({ setIsLoading, setVideos, setCount, params: { ...params, page, pageSize } });
  };

  const onClear = async () => {
    reset(defaultValues);
    getAllVideos({
      setCount,
      setVideos,
      setIsLoading,
      params: { ...defaultValues, page, pageSize },
    });
  };

  return {
    page,
    count,
    token,
    watch,
    reset,
    videos,
    router,
    params,
    onClear,
    setPage,
    setValue,
    pageSize,
    onSearch,
    userType,
    setParams,
    isLoading,
    videoLink,
    setVideoLink,
    defaultValues,
    groupedOptions,
  };
};

export default useVideo;

const defaultValues = {
  position: "All",
  sort: "Newest",
};
