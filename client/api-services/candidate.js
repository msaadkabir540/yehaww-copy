import {
  REPORT_JOB,
  ADD_COVER_LETTER,
  GET_MY_VIDEO_INTERVIEW,
  UPLOAD_VIDEO_INTERVIEW,
} from "utils/endpoints";
import { apiRequest } from "utils/helper";

export const addCoverLetter = async ({ body, setLoading }) => {
  setLoading(true);
  await apiRequest({ type: "put", path: ADD_COVER_LETTER, body });
  setLoading(false);
};

export const getMyVideoInterviews = async ({
  data,
  setLoading,
  setInterviews,
  setInterviewQuestions,
}) => {
  setLoading && setLoading(true);
  const res = await apiRequest({
    type: "get",
    path: GET_MY_VIDEO_INTERVIEW,
    params: data,
  });
  if (res.status === 200) {
    setInterviews(res.data.jobs);
    setInterviewQuestions && setInterviewQuestions(res.data?.jobs?.interviewQuestions);
  }
  setLoading && setLoading(false);
};

export const uploadInterviewVideo = async ({ data }) => {
  const res = await apiRequest({
    type: "put",
    path: UPLOAD_VIDEO_INTERVIEW,
    body: data,
    formData: true,
  });
};

export const getInterviewData = async ({ jobId, setLoading, setInterview }) => {
  setLoading && setLoading(true);
  const res = await apiRequest({
    type: "get",
    path: `/job/getInterviewData/${jobId}`,
  });
  if (res.status === 200) {
    setInterview(res.data.interviewData);
  }
  setLoading && setLoading(false);
};

// export const bulkaddProfileLinks = async () => {
//   await apiRequest({
//     type: "get",
//     path: "/candidate/bulk-add-profile-link",
//   });
// };

export const addReportAJob = async ({ formData }) => {
  const res = await apiRequest({
    type: "post",
    path: REPORT_JOB,
    body: formData,
  });
  if (res.status === 200) {
    return res.data;
  }
};
