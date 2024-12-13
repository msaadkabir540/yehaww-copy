import axios from "utils/axios";

import { apiRequest } from "utils/helper";
import { setAppLoader, setDashboardData } from "store";
import { CONTACT_US, FIND_CANDIDATES, GET_DASHBOARD_DATA } from "utils/endpoints";
import { setFormError } from "helpers/hook-form-helper";

export const findCandidates = async ({
  params,
  setError,
  setCount,
  setCandidates,
  controller = false,
}) => {
  const res = await apiRequest({
    type: "get",
    path: FIND_CANDIDATES,
    params: JSON.parse(params),
    config: { ...(controller && { signal: controller.signal }) },
  });
  setFormError(res, setError);
  if (res.status === 200) {
    setCandidates(res.data.candidates);
    setCount(res.data.count);
  }
};

export const getDashboardData = async ({ dispatch }) => {
  const res = await apiRequest({ type: "get", path: GET_DASHBOARD_DATA });
  if (res.status === 200) {
    dispatch(setDashboardData(res.data));
  }
};

export const contactUs = async ({ body, setLoading }) => {
  setLoading(true);
  await apiRequest({ type: "post", path: CONTACT_US, body });
  setLoading(false);
};
