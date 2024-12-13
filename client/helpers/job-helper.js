import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { useScrollPosition } from "utils/useScrollPosition";
import { getAllJobs, updateInterestedJob } from "api-services/employer";
import { country_list, employmentTypes, newPositionArr1, positionArr } from "utils/arrayHelper";

export const useJob = () => {
  const pageSize = 10;

  const router = useRouter();
  const dispatch = useDispatch();
  const { scrollPosition } = useScrollPosition();
  const { user } = useSelector((state) => state.app);
  const { handleSubmit, register, reset, watch, setValue } = useForm();

  const [page, setPage] = useState(router?.query?.page || 0);
  const [jobs, setJobs] = useState(false);
  const [prevPage, setPrevPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [prevParams, setPrevParams] = useState({});
  const [btnLoader, setBtnLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [verifyReferenceBanner, setVerifyReferenceBanner] = useState(false);

  const getJobsHandler = async (queryParams) => {
    setLoading(true);
    const params = {
      ...queryParams,
      ...(router?.query?.companyName && { companyName: router.query.companyName }),
      ...(queryParams?.position && {
        position: queryParams?.position,
      }),
      ...(queryParams?.category && {
        category: queryParams?.category,
      }),
      sortBy: watch("sortBy"),
      mapView,
      pageSize: mapView ? 50 : pageSize,
      page: page,
    };
    setPrevParams(params);
    setPrevPage(router?.query?.page);

    params.position = params?.position?.replace?.("-", "/");
    await getAllJobs({
      params,
      mapView,
      setJobs,
      setMapView,
    });
    setLoading(false);
  };

  const handleInterested = async (jobId, interested, coverLetter) => {
    setBtnLoader(true);
    const res = await updateInterestedJob({
      body: { jobId, interested, coverLetter },
      setVerifyReferenceBanner,
    });
    if (res) {
      setOpenModal(false);
      setLoading(true);
      await getAllJobs({
        setJobs,
        setMapView,
        params: prevParams,
      });
      setLoading(false);
    }
    setBtnLoader(false);
  };

  const onSubmit = async (data) => {
    getJobsHandler({
      ...(data.position && {
        position: data?.position?.split(" (")?.[0]?.replace("/", "-"),
        category: data?.position?.split(" (")?.[1]?.replace("(", "")?.replace(")", ""),
      }),
      ...(data.team && { team: data.team }),
      ...(data.employmentType && { employmentType: data.employmentType }),
      ...(data.salary && data.salary !== "0" && { salary: data.salary }),
      ...(data.currentLocation && { currentlyLocatedCountry: data.currentLocation }),
      ...(data.category && { category: data.category }),
      ...(data.jobType && { jobType: data.jobType }),
      ...(data.levelOfOperation && { levelOfOperation: data.levelOfOperation }),
      ...(data.liveIn && { liveIn: data.liveIn }),
    });
  };

  const handleClear = () => {
    router.push("/jobs");
    getJobsHandler({});
    setTimeout(() => {
      reset();
    }, 10);
  };

  useEffect(() => {
    router.push({
      pathname: "/jobs",
      query: { page },
    });
  }, [page]);

  useEffect(() => {
    if (parseInt(router?.query?.page) > 0) setPage(parseInt(router?.query?.page));
  }, [router]);

  useEffect(() => {
    getJobsHandler({
      ...(router?.query?.position && {
        position: router?.query?.position?.split(" (")?.[0]?.replace("/", "-"),
        category: router?.query?.position?.split(" (")?.[1]?.replace("(", "")?.replace(")", ""),
      }),
      ...(router?.query?.employmentType && { employmentType: router?.query?.employmentType }),
      ...(router?.query?.currentLocation && {
        currentlyLocatedCountry: router?.query?.currentLocation,
      }),
      ...(router?.query?.category && { category: router?.query?.category }),
      ...(router?.query?.jobType && { jobType: router?.query?.jobType }),
      ...(router?.query?.levelOfOperation && {
        levelOfOperation: router?.query?.levelOfOperation,
      }),
    });
  }, [page, watch("sortBy"), mapView]);

  useEffect(() => {
    if (router.isReady) {
      router?.query?.position && setValue("position", router?.query?.position?.replace("-", "/"));
      router?.query?.jobType && setValue("jobType", router?.query?.jobType);
      router?.query?.employmentType && setValue("employmentType", router?.query?.employmentType);
      router?.query?.currentLocation && setValue("currentLocation", router?.query?.currentLocation);
      router?.query?.levelOfOperation &&
        setValue("levelOfOperation", router?.query?.levelOfOperation);
    }
  }, [router]);

  useEffect(() => {
    const categories = newPositionArr1.filter((x) => x.includes("+"));
    const positions = newPositionArr1.filter((x) => !x.includes("+"));
    const groupedOptionsArr = categories.map((category) => {
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
    });
    setGroupedOptions(groupedOptionsArr);
  }, []);

  return {
    jobs,
    page,
    user,
    sorts,
    reset,
    watch,
    router,
    loading,
    mapView,
    setPage,
    onSubmit,
    register,
    setValue,
    dispatch,
    btnLoader,
    openModal,
    setMapView,
    handleClear,
    setOpenModal,
    handleSubmit,
    filterListArr,
    groupedOptions,
    scrollPosition,
    handleInterested,
    verifyReferenceBanner,
    pageSize: mapView ? 50 : pageSize,
  };
};

const sorts = [
  { label: "Latest", value: "latest" },
  { label: "Start Date", value: "startDate" },
  { label: "Salary (Hight to Low)", value: "salary" },
];

const filterListArr = [
  {
    label: "Employment Type",
    name: "employmentType",
    option: ["Any", ...employmentTypes],
  },
  {
    label: "Position",
    component: "reactSelect",
    name: "position",
    option: ["Any", ...positionArr],
  },
  {
    label: "Team / Couple",
    name: "team",
    option: ["Any", "Yes", "No"],
  },
  {
    label: "Salary",
    name: "salary",
    option: [
      { label: "Any", value: 0 },
      { label: "0 - 1,500", value: 1 },
      { label: "1,501 - 3,000", value: 2 },
      { label: "3,001 - 5,000", value: 3 },
      { label: "5,001 - 10,000", value: 4 },
      { label: "10,001 - 15,000", value: 5 },
      { label: "15,000+", value: 6 },
    ],
  },
  {
    label: "Location",
    name: "currentLocation",
    option: ["Any", ...country_list],
  },
  {
    label: "Live In",
    name: "liveIn",
    option: ["Any", "Yes", "No"],
  },
];
