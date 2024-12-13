import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  skills,
  languages,
  country_list,
  experienceLevel,
  educationOptions,
} from "utils/arrayHelper";
import { removeKeys } from "utils/helper";
import { findCandidates } from "api-services/dashboard";
import { getAllAppliedCandidates } from "api-services/employer";

const useFindResult = ({ appliedCandidates, allShortListed = false }) => {
  const pageSize = 10;

  const router = useRouter();

  const params = router?.query;
  const dispatch = useDispatch();
  const { user, token, candidateSearch } = useSelector((state) => state.app);

  const {
    reset,
    watch,
    register,
    setValue,
    setError,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialFilters,
  });

  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const [review, setReview] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [filterData, setFilterData] = useState(null);
  const [page, setPage] = useState(router?.query?.page || 0);
  const [candidateType, setCandidateType] = useState(allShortListed ? "shortlisted" : "");

  useEffect(() => {
    if (
      watch("skills")?.length > 0 ||
      watch("languages")?.length > 0 ||
      watch("nationalities")?.length > 0 ||
      watch("qualifications")?.length > 0 ||
      watch("experienceLevelName")?.length > 0
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [watch()]);

  useEffect(() => {
    const controller = new AbortController();
    if ((router.isReady && Object.values(params).length) || allShortListed) {
      if (filterData !== null)
        arrToMap.forEach((x) => {
          filterData[x] = filterData[x]?.[0]?.value
            ? filterData[x].map((y) => y?.value)
            : filterData[x];
        });
      getCandidates(
        controller,
        removeKeys(
          {
            ...filterData,
            visas: filterData?.visas ? filterData?.visas : "",
          },
          [],
          true
        )
      );
    } else {
      getCandidates(controller);
    }
    return () => {
      controller.abort();
    };
  }, [router, page, candidateType]);

  useEffect(() => {
    if (router.isReady) {
      const resetData = removeKeys(
        {
          ...(!router.query.employerSearch && {
            ...params,
            position: params.position?.replace("-", "/"),
          }),
          visas: params?.visas !== "false" && params?.visas?.length ? params.visas : "",
          ...(router.query.employerSearch && {
            ...candidateSearch,
            ...(candidateSearch?.gender &&
              candidateSearch?.gender !== "All" &&
              (() => {
                const res = { [`${candidateSearch.gender === "Male" ? "male" : "female"}`]: true };
                return res;
              })()),
            visas: candidateSearch.visas ? candidateSearch.visas : "",
            teamCouple:
              candidateSearch.teamCouple === "Yes"
                ? true
                : candidateSearch.teamCouple === "No"
                ? false
                : undefined,
          }),
          page,
          pageSize,
          resultCard: true,
        },
        [],
        true
      );
      reset(resetData);
    }
  }, [router]);

  console.error(watch());

  const getCandidates = (controller, extraParams) => {
    if (appliedCandidates) {
      return getAllAppliedCandidates({
        params: {
          page,
          pageSize,
          candidateType,
          jobId: router?.query?.jobId,
          ...(allShortListed && { allShortListed }),
          ...extraParams,
          visas: extraParams?.visas !== "false" ? extraParams?.visas : "",
        },
        setCandidates,
        router,
      });
    } else {
      return findCandidates({
        params: JSON.stringify(
          removeKeys(
            {
              ...(!router.query.employerSearch && {
                ...params,
                position: params.position?.replace("-", "/"),
              }),
              visas: params?.visas !== "false" && params?.visas?.length ? params.visas : "",
              ...(router.query.employerSearch && {
                ...candidateSearch,
                visas: candidateSearch.visas ? candidateSearch.visas : "",
                teamCouple:
                  candidateSearch.teamCouple === "Yes"
                    ? true
                    : candidateSearch.teamCouple === "No"
                    ? false
                    : undefined,
              }),
              profileCompletion: 100,
              page,
              pageSize,
              resultCard: true,
              ...extraParams,
            },
            [],
            true
          )
        ),
        setCount,
        dispatch,
        setError,
        controller,
        setCandidates,
      });
    }
  };

  const onChange = (page) => {
    router.push({ query: { ...router.query, page } });
  };

  const onSubmit = (data) => {
    const filteredData = { ...data };
    delete filteredData.page;
    delete filteredData.pageSize;
    setFilterData(filteredData);

    const { male, female } = data;
    arrToMap.forEach((x) => {
      data[x] = data[x]?.[0]?.value ? data[x].map((y) => y?.value) : data[x];
    });
    removeKeys(data, ["male", "female"]);
    getCandidates(
      null,
      removeKeys(
        {
          ...data,
          gender: female && male ? "All" : female ? "Female" : male ? "Male" : "All",
          visas: data.visas ? data.visas : "",
          // video: data.video ? data.video : "",
          // verified: data.verified ? data.verified : "",
          // skills: data.skills ? data.skills : "",
        },
        [],
        true
      )
    );
  };

  const subscribed = (candidateId) =>
    user?.subscriptionStatus === "active" || user.candidateId === candidateId;

  return {
    page,
    user,
    count,
    reset,
    watch,
    token,
    review,
    errors,
    active,
    router,
    setPage,
    pageSize,
    setValue,
    onSubmit,
    register,
    disabled,
    onChange,
    setReview,
    getValues,
    setActive,
    subscribed,
    candidates,
    setDisabled,
    clearErrors,
    checkBoxArr,
    handleSubmit,
    candidateType,
    getCandidates,
    initialFilters,
    setCandidateType,
    multiSelectFilters,
  };
};

export default useFindResult;

const initialFilters = {
  experienceLevelName: [],
  languages: [],
  nationalities: [],
  qualifications: [],
  skills: [],
  teamCouple: false,
  verified: false,
  video: false,
  visas: [],
};

const arrToMap = ["experienceLevelName", "nationalities", "qualifications", "languages", "skills"];

const checkBoxArr = [
  { name: "male", label: "Male" },
  { name: "female", label: "Female" },
  { name: "teamCouple", label: "Team/Couple Only" },
  { name: "video", label: "Introduction Video" },
  { name: "visas", label: "B1/B2 Visa", value: "B1/B2" },
  {
    name: "visas",
    label: "Green Card / US resident",
    value: "Green Card / US resident",
  },
  { name: "visas", label: "European Visa / Schengen Visa", value: "European Visa / Schengen Visa" },
  { name: "verified", label: "Verified References" },
];

const multiSelectFilters = [
  {
    name: "experienceLevelName",
    label: "Experience Level Name",
    options: experienceLevel,
  },
  {
    name: "nationalities",
    label: "Nationalities",
    options: country_list,
  },
  {
    name: "qualifications",
    label: "Qualifications",
    options: educationOptions,
  },
  {
    name: "languages",
    label: "Languages",
    options: languages,
  },
  {
    name: "skills",
    label: "Skills",
    options: skills,
  },
];
