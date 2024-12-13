import { setUser, setLogout } from "store";
import { apiRequest } from "utils/helper";
import {
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  GET_USER_ROUTE,
  RESET_PASS_ROUTE,
  FORGET_PASS_ROUTE,
  CHANGE_PASS_ROUTE,
  SOCIAL_LOGIN_ROUTE,
  DELETE_ACCOUNT_ROUTE,
} from "utils/endpoints";
import { setFormError } from "helpers/hook-form-helper";
import createNotification from "common/create-notification";

export const login = async ({ data, router, dispatch, setError }) => {
  const res = await apiRequest({ type: "post", path: LOGIN_ROUTE, body: data });
  if (res.status === 200) {
    dispatch(setUser({ user: res?.data?.user, token: res?.headers?.authorization }));
    router.push("/");
  } else {
    setFormError(res, setError);
  }
};

export const socialLogin = async ({ data, router, dispatch, setError }) => {
  const res = await apiRequest({ type: "post", path: SOCIAL_LOGIN_ROUTE, body: data });
  if (res.status === 200) {
    dispatch(setUser({ user: res?.data?.user, token: res?.headers?.authorization }));
    router.push("/");
  } else if (res?.data?.msg == "Email not found!") {
    router.push("/sign-up");
  } else {
    setFormError(res, setError);
  }
};

export const signUp = async ({ data, router, dispatch, setError }) => {
  const res = await apiRequest({ type: "post", path: SIGNUP_ROUTE, body: data });
  if (res.status === 201) {
    dispatch(setUser({ user: res.data.user, token: res.headers.authorization }));
    router.push("/");
  } else {
    setFormError(res, setError);
  }
};

export const forgetPass = async ({ data, setError, handleClose }) => {
  const res = await apiRequest({ type: "post", path: FORGET_PASS_ROUTE, body: data });
  setFormError(res, setError);
  if (res?.status === 200) {
    handleClose();
  }
};

export const resetPasswordModal = async ({ body, setError, setResetModal }) => {
  const res = await apiRequest({ type: "post", path: RESET_PASS_ROUTE, body });
  setFormError(res, setError);
  if (res.status === 200) {
    setResetModal(false);
  } else if (res.status === 500) {
    setResetModal(false);
    createNotification("error", res?.data?.msg);
  }
};

export const changePassword = async ({ data, setLoading, setError, router, route, reset }) => {
  setLoading(true);
  const res = await apiRequest({ type: "post", path: CHANGE_PASS_ROUTE, body: data });
  setFormError(res, setError);
  if (res.status === 200) {
    route && router.push(route);
    reset && reset();
  }
  setLoading(false);
};

export const deleteAccount = async ({ data, setSuccess, router, dispatch }) => {
  setSuccess && setSuccess(true);
  const res = await apiRequest({ type: "post", path: DELETE_ACCOUNT_ROUTE, body: data });
  if (res.status === 200) {
    setSuccess && setSuccess(false);
    dispatch(setLogout());
    router.push("/");
  }
  setSuccess && setSuccess(false);
};

export const getUserByToken = async ({ dispatch, router }) => {
  const res = await apiRequest({
    type: "get",
    path: GET_USER_ROUTE,
  });
  if (res.status === 200) {
    dispatch(setUser({ user: res?.data }));
  } else {
    dispatch(setLogout());
    router.push("/login");
  }
};
