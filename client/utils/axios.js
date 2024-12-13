import axios from "axios";

import createNotification from "common/create-notification";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

axios.interceptors.request.use(
  (req) => {
    req.headers.Authorization = localStorage.getItem("token");
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    if (res.status === 422) {
      createNotification("error", res?.data?.msg || "Invalid Data");
    } else if (
      (["post", "put", "delete"].includes(res?.config?.method) &&
        !res.config.url.includes("login")) ||
      res?.config?.url?.includes("requestPartnerVerification")
    ) {
      createNotification("success", res?.data?.msg || "Success");
    }
    return res;
  },
  (error) => {
    console.error(error);
    if (error?.response?.status !== 422) {
      createNotification("error", error?.response?.data?.msg || "Something went wrong");
    }
    return error.response;
  }
);

export default axios;
