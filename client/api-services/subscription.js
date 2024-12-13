import { apiRequest } from "utils/helper";
import { CANCEL_REQUEST, GET_HISTORY, GET_INVOICE } from "utils/endpoints";

export const cancelSubscription = async ({ formData }) => {
  const res = await apiRequest({
    type: "post",
    path: CANCEL_REQUEST,
    body: formData,
  });
  if (res.status === 200) {
    return true;
  }
};

export const getHistory = async ({ params }) => {
  const res = await apiRequest({
    type: "get",
    path: GET_HISTORY,
    params,
  });
  if (res.status === 200) {
    return res.data;
  }
};

export const getInvoice = async ({ params }) => {
  const res = await apiRequest({
    type: "get",
    path: GET_INVOICE,
    params,
  });
  if (res.status === 200) {
    return res.data;
  }
};
