import axios from "axios";
import {
  RESUME_ROUTE,
  UPLOAD_ROUTE,
  CLEAR_PARTNER,
  ABOUT_ME_ROUTE,
  REFERENCE_ROUTE,
  UPDATE_SETTINGS,
  EXPERIENCE_ROUTE,
  VERIFY_REFERENCE,
  AVAILABILITY_ROUTE,
  QUALIFICATION_ROUTE,
  PERSONAL_INFO_ROUTE,
  CERTIFICATIONS_ROUTE,
  GET_CANDIDATE_PROFILE,
  GET_PROFILE_META_ROUTE,
  GET_REFERENCE_DATA_ROUTE,
  GET_PROFILE_SECTION_ROUTE,
  REQUEST_PARTNER_VERIFICATION,
  UPDATE_PROFILE_LINK,
} from "utils/endpoints";
import { apiRequest } from "utils/helper";
import { setFormError } from "helpers/hook-form-helper";
import createNotification from "common/create-notification";

export const profileMetaData = async ({ setIsLoading, setUserData, setSettings, token }) => {
  axios.defaults.headers.Authorization = localStorage.getItem("token") || token;
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await apiRequest({ type: "get", path: GET_PROFILE_META_ROUTE });
  if (res.status === 200) {
    setIsLoading(false);
    setUserData(res?.data);
    setSettings({
      emailAlerts: res?.data.emailAlerts,
      profileLinkId: res?.data.profileLinkId,
      profilePublicView: res?.data.profilePublicView,
    });
  }
  setIsLoading(false);
};

export const updateSettings = async ({
  body,
  name,
  token,
  setUserData,
  setSettings,
  setIsLoading,
  setSettingsLoader,
}) => {
  setSettingsLoader(name);
  const res = await apiRequest({ type: "put", path: UPDATE_SETTINGS, body });
  if (res.status === 200) {
    await profileMetaData({ setIsLoading, setUserData, setSettings, token });
  }
  setSettingsLoader(false);
};

export const updateProfileLink = async ({
  body,
  token,
  setEditUrl,
  setSettings,
  setUserData,
  setIsLoading,
  setBtnLoading,
}) => {
  setBtnLoading(true);
  const res = await apiRequest({ type: "put", path: UPDATE_PROFILE_LINK, body });
  if (res.status === 200) {
    await profileMetaData({ setIsLoading, setUserData, setSettings, token });
    setBtnLoading(false);
    setEditUrl(false);
  } else {
    setEditUrl(false);
    setBtnLoading(false);
  }
  setEditUrl(false);
};

export const profileSectionData = async ({ properties, setResData, id }) => {
  const res = await apiRequest({
    type: "get",
    path: `${GET_PROFILE_SECTION_ROUTE}/${id}`,
    params: { properties },
  });
  if (res.status === 200) {
    setResData(res?.data);
  }
};

export const about_me = async ({ data, router, setIsLoading, setError }) => {
  setIsLoading(true);
  const res = await apiRequest({ type: "put", path: ABOUT_ME_ROUTE, body: data });
  setFormError(res, setError);
  if (res.status === 200) {
    router.push("/profile-overview/profile");
    setIsLoading(false);
  }
  setIsLoading(false);
};

export const availability = async ({ data, router, setIsLoading, setError }) => {
  const res = await apiRequest({ type: "put", path: AVAILABILITY_ROUTE, body: data });
  setFormError(res, setError);
  if (res.status === 200) {
    router.push("/profile-overview/profile");
  }
  setIsLoading(false);
};

export const experience = async ({ body, router, setLoading, setError }) => {
  setLoading(true);
  const res = await apiRequest({
    type: "put",
    path: EXPERIENCE_ROUTE,
    body,
  });
  if (res.status === 200) {
    router.push("/profile-overview/profile");
  }
  setFormError(res, setError);
  setLoading(false);
};

export const resume = async ({ setIsLoading, data, router }) => {
  setIsLoading(true);
  const res = await apiRequest({ type: "put", path: RESUME_ROUTE, body: data });
  if (res.status === 200) {
    setIsLoading(false);
    router.push("/profile-overview/profile");
  }
  setIsLoading(false);
};

export const myUpload = async ({ data, router, setIsLoading }) => {
  setIsLoading(true);
  const res = await apiRequest({ type: "put", path: UPLOAD_ROUTE, body: data, formData: true });
  if (res.status === 200 && router) {
    setIsLoading(false);
    router.push("/profile-overview/profile");
  }
  setIsLoading(false);
};

export const references = async ({ data, router, setIsLoading }) => {
  setIsLoading(true);
  const res = await apiRequest({ type: "put", path: REFERENCE_ROUTE, body: data });
  if (res.status === 200) {
    setIsLoading(false);
    router.push("/profile-overview/profile");
  }
  setIsLoading(false);
};

export const qualificationSkills = async ({ data, router, setIsLoading }) => {
  setIsLoading(true);
  const res = await apiRequest({ type: "put", path: QUALIFICATION_ROUTE, body: data });
  if (res.status === 200) {
    setIsLoading(false);
    router.push("/profile-overview/profile");
  }
  setIsLoading(false);
};

export const getUserProfile = async ({ id, jobId, email, setIsLoading, setProfile }) => {
  setIsLoading(true);
  const res = await apiRequest({
    type: "get",
    path: GET_CANDIDATE_PROFILE(id, jobId),
    params: { mapped: true, ...(email && { email }) },
  });
  if (res.status === 200) {
    setProfile(res.data);
  }
  setIsLoading(false);
};

export const certifications = async ({ data, router, setIsLoading }) => {
  const res = await apiRequest({
    type: "put",
    path: CERTIFICATIONS_ROUTE,
    body: data,
  });
  if (res.status === 200) {
    setIsLoading(false);
  }
  setIsLoading(false);
};

export const personalInformation = async ({ data, router, setIsLoading, setError }) => {
  setIsLoading(true);
  const res = await apiRequest({ type: "put", path: PERSONAL_INFO_ROUTE, body: data });
  setFormError(res, setError);
  if (res.status === 200) {
    setIsLoading(false);
    router.push("/profile-overview/profile");
  } else if (res.status === 400) {
    setIsLoading(false);
    return res?.data?.errors;
  }
  setIsLoading(false);
};

export const getReferenceData = async ({ params, setReferenceData, router, setLoading, reset }) => {
  setLoading(true);
  const res = await apiRequest({ type: "get", path: GET_REFERENCE_DATA_ROUTE, params });
  if (res?.status === 200) {
    setReferenceData(res.data);
    params?.verified && res?.data?.verified && reset(res?.data?.verified?.ratings);
  }
  if (res?.status === 409) {
    router.push("/");
    createNotification("error", res?.data?.msg);
  }
  setLoading(false);
};

export const verifyReferences = async ({ body, params, router }) => {
  const res = await apiRequest({
    type: "post",
    path: VERIFY_REFERENCE,
    body,
    params,
  });
  if (res.status === 200) {
    router.push("/");
  }
  if (res.status === 409) {
    router.push("/");
  }
};

export const requestPartnerVerification = async ({ params, setValue, setError }) => {
  const res = await apiRequest({
    type: "get",
    path: REQUEST_PARTNER_VERIFICATION,
    params,
  });
  if (res.status === 200) {
    setValue("personalInfo.teamStatus", res.data.teamStatus);
  }
  setFormError(res, setError);
};

export const clearPartnerEmail = async () => {
  await apiRequest({
    type: "put",
    path: CLEAR_PARTNER,
  });
};
