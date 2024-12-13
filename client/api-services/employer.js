import { toast } from "react-toastify";
import { addDecimal, apiRequest, removeKeys } from "utils/helper";
import {
  GET_JOB,
  POST_JOB,
  GET_DRAFT,
  DELETE_JOB,
  POST_DRAFT,
  GET_MY_JOBS,
  GET_ALL_JOBS,
  UPDATE_A_JOB,
  DELETE_DRAFT,
  UPDATE_A_DRAFT,
  ADVERTISE_ROUTE,
  GET_ACTIVE_POSTS,
  EMPLOYER_SETTINGS,
  ADD_CANDIDATE_NOTE,
  ADD_VERIFY_REFERENCE,
  GET_DRAFT_BY_EMPLOYER,
  UPDATE_INTERESTED_JOB,
  UPDATE_POSITION_FILLED,
  UPDATE_MY_JOB_INTERVIEW,
  EMPLOYER_PERSONAL_DETAIL,
  GET_ALL_APPLIED_CANDIDATES,
  UPDATE_SHORTLIST_CANDIDATES,
} from "utils/endpoints";
import { setFormError } from "helpers/hook-form-helper";
import { getCoordinates } from "helpers/map-helper";
import createNotification from "common/create-notification";

export const updateEmployerPersonalDetails = async ({ personalDetails, setError }) => {
  const res = await apiRequest({
    type: "put",
    path: EMPLOYER_PERSONAL_DETAIL,
    body: { personalDetails },
  });
  setFormError(res, setError);
  if (res.status === 200) {
    return res.data;
  }
};

export const updateEmployerSettings = async ({ data }) => {
  const res = await apiRequest({
    type: "put",
    path: EMPLOYER_SETTINGS,
    body: data,
  });
  if (res.status === 200) {
  }
};

export const addJob = async ({ data, setError, router }) => {
  const res = await apiRequest({
    type: "post",
    path: POST_JOB,
    body: data,
  });
  setFormError(res, setError);
  if (res.status === 200) {
    router.push("/candidate/active-post");
  }
};

export const getJob = async ({
  id,
  setJobData,
  reset,
  router,
  setLoading,
  setResetCities,
  coordinates = false,
}) => {
  setLoading && setLoading(true);
  const res = await apiRequest({ type: "get", path: GET_JOB(id) });
  if (res.status === 200) {
    if (coordinates) {
      coordinates = await getCoordinates(
        `${res.data?.positionInfo?.currentlyLocated?.country} ${res.data?.positionInfo?.currentlyLocated?.city}`
      );

      if (res?.data?.positionInfo?.location?.coordinates) {
        res.data.position = res?.data?.positionInfo?.location?.coordinates;
      } else {
        res.data.position = coordinates?.lat ? coordinates : "";
      }
    }
    setJobData && setJobData(res.data);
    if (reset) {
      removeKeys(res.data, [
        "__v",
        "_id",
        "jobId",
        "userId",
        "jobType",
        "overview",
        "updatedAt",
        "createdAt",
        "jobFilledStatus",
        "interested",
      ]);
      res.data.preferredCandidate.languages = res.data.preferredCandidate.languages.map(
        ({ name, fluency }) => {
          return { name, fluency };
        }
      );
      res.data.positionInfo.startDate = new Date(res?.data?.positionInfo?.startDate);
      setResetCities({
        homeBase: res.data.positionInfo.homeBase.city,
        currentlyLocated: res.data.positionInfo.currentlyLocated.city,
      });
      reset && reset({ job: { ...res?.data } });
    }
  } else {
    res?.data?.msg;
    createNotification("error", res?.data?.msg);
    router?.push("/404");
  }
  setLoading && setLoading(false);
};

export const getJobById = async ({ id, setJobData }) => {
  const res = await apiRequest({
    type: "get",
    path: GET_JOB(id),
  });
  if (res.status === 200) {
    setJobData && setJobData(res.data);
  }
};

export const getAllJobs = async ({ params, mapView, setJobs, setMapView }) => {
  const res = await apiRequest({
    type: "get",
    path: GET_ALL_JOBS,
    params,
  });
  if (res.status === 200) {
    if (mapView) {
      res.data.jobs = res.data.jobs.map(async (x, index) => {
        const {
          currentlyLocated: { country, city },
        } = x;
        x = removeKeys(x, ["homeBase"]);
        return {
          id: index,
          ...x,
          position: await getCoordinates(`${country} ${city}`),
        };
      });
      let jobs = await Promise.all(res.data.jobs);
      jobs = jobs.map((x) => {
        return {
          ...x,
          position: {
            lat: parseFloat(
              x?.position?.lat?.toFixed(3).toString() + Math.floor(Math.random() * 10000)
            ),
            lng: parseFloat(
              x?.position?.lng?.toFixed(3).toString() + Math.floor(Math.random() * 10000)
            ),
          },
        };
      });
      mapView && setMapView(jobs?.length > 0 ? true : false);
      setJobs({ jobs, jobsCount: jobs.length });
    } else {
      setJobs(res.data);
    }
  }
};

export const updateJob = async ({ id, data, setError, router }) => {
  const res = await apiRequest({
    type: "put",
    path: UPDATE_A_JOB(id),
    body: data,
  });
  setFormError(res, setError);
  if (res.status === 200) {
    router.push("/candidate/active-post");
  }
};

export const getActivePosts = async ({ params }) => {
  const res = await apiRequest({
    type: "get",
    path: GET_ACTIVE_POSTS,
    params,
  });
  if (res.status === 200) {
    return res.data;
  }
};

export const updatePositionFilled = async (id) => {
  const res = await apiRequest({
    type: "put",
    path: UPDATE_POSITION_FILLED(id),
  });
  if (res.status === 200) {
    return res.data;
  }
};

export const addVerifiedReference = async ({ data, params }) => {
  const res = await apiRequest({
    type: "post",
    path: ADD_VERIFY_REFERENCE,
    body: data,
    params,
  });
  if (res.status === 200) {
  }
};

export const updateInterestedJob = async ({ body, setVerifyReferenceBanner }) => {
  const res = await apiRequest({
    type: "put",
    path: UPDATE_INTERESTED_JOB,
    body,
  });
  if (res.status === 200) {
    setVerifyReferenceBanner && setVerifyReferenceBanner(true);
  }

  if (res.status === 409) {
    toast.error(
      <>
        {res?.data?.msg.map((x) => (
          <p>{x}</p>
        ))}
      </>,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 15000,
      }
    );
  }
  if (res?.status === 422) {
    createNotification("error", "Please Enter Cover Letter");
  }
};

export const getMyJobs = async ({ setJobs, setLoading }) => {
  setLoading && setLoading(true);
  const res = await apiRequest({
    type: "get",
    path: GET_MY_JOBS,
  });
  if (res.status === 200) {
    setJobs(res.data.myJobs);
  }
  setLoading && setLoading(false);
};

export const requestInterview = async ({ data, params }) => {
  const res = await apiRequest({
    type: "put",
    path: UPDATE_MY_JOB_INTERVIEW,
    body: data,
    params,
  });
  if (res.status === 200) {
  }
};

export const updateShortlistCandidates = async ({ data, params }) => {
  const res = await apiRequest({
    type: "put",
    path: UPDATE_SHORTLIST_CANDIDATES,
    body: data,
    params,
  });
  if (res.status === 200) {
  }
};

export const getAllAppliedCandidates = async ({ router, params, setCandidates }) => {
  const res = await apiRequest({
    type: "get",
    path: GET_ALL_APPLIED_CANDIDATES,
    params,
  });
  if (res.status === 200) {
    setCandidates(res.data);
  } else if (res.status === 404) {
    router.push("/404");
  }
};

export const deleteJob = async ({ id, router }) => {
  const res = await apiRequest({
    type: "delete",
    path: DELETE_JOB(id),
  });
  if (res.status === 200) {
    return res.data;
  }
};

export const addCandidateNote = async ({ body, setLoading }) => {
  setLoading(true);
  await apiRequest({ type: "put", path: ADD_CANDIDATE_NOTE, body });
  setLoading(false);
};

export const addAdvertiser = async ({ data, reset, setError }) => {
  const res = await apiRequest({
    type: "post",
    path: ADVERTISE_ROUTE,
    body: data,
  });
  if (res.status === 200) {
    reset && reset();
    return res.data;
  } else {
    setFormError(res, setError);
  }
};

////// Job Drafts
export const addDraft = async ({ data, setError, router }) => {
  const res = await apiRequest({
    type: "post",
    path: POST_DRAFT,
    body: data,
  });
  setFormError(res, setError);
  if (res.status === 200) {
    router.push("/candidate/draft-post");
  }
};

export const getDraftByEmployer = async ({ params }) => {
  const res = await apiRequest({
    type: "get",
    path: GET_DRAFT_BY_EMPLOYER,
    params,
  });
  if (res.status === 200) {
    return res.data;
  }
};

export const updateDraft = async ({ id, data, setError, router }) => {
  const res = await apiRequest({
    type: "put",
    path: UPDATE_A_DRAFT(id),
    body: data,
  });
  setFormError(res, setError);
  if (res.status === 200) {
    router.push("/candidate/draft-post");
  }
};

export const deleteDraft = async ({ id }) => {
  const res = await apiRequest({
    type: "delete",
    path: DELETE_DRAFT(id),
  });
  if (res.status === 200) {
    return res.data;
  }
};

export const getDraft = async ({
  id,
  reset,
  setJobData,
  setLoading,
  setResetCities,
  coordinates = false,
}) => {
  setLoading && setLoading(true);
  const res = await apiRequest({
    type: "get",
    path: GET_DRAFT(id),
  });
  if (res?.status === 200) {
    if (coordinates) {
      coordinates = await getCoordinates(
        `${res?.data?.positionInfo?.currentlyLocated?.country} ${res?.data?.positionInfo?.currentlyLocated?.city}`
      );
      res.data.position = coordinates?.lat ? coordinates : "";
    }
    setJobData && setJobData(res?.data);
    if (reset) {
      removeKeys(res?.data, [
        "__v",
        "_id",
        "jobId",
        "userId",
        "jobType",
        "overview",
        "updatedAt",
        "createdAt",
        "interested",
        "jobFilledStatus",
      ]);
      res.data.preferredCandidate.languages = res.data.preferredCandidate.languages.map(
        ({ name, fluency }) => {
          return { name, fluency };
        }
      );
      if (res.data.positionInfo.startDate) {
        res.data.positionInfo.startDate = new Date(res?.data?.positionInfo?.startDate);
      }
      setResetCities({
        homeBase: res?.data?.positionInfo?.homeBase?.city,
        currentlyLocated: res?.data?.positionInfo?.currentlyLocated?.city,
      });
      reset && reset({ job: { ...res?.data } });
    }
  }
  setLoading && setLoading(false);
};
