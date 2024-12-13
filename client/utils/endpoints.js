//auth
export const LOGIN_ROUTE = "/auth/login";
export const SOCIAL_LOGIN_ROUTE = "/auth/social-login";
export const GET_USER_ROUTE = "/auth/user";
export const SIGNUP_ROUTE = "/auth/sign-up";
export const FORGET_PASS_ROUTE = "/auth/forgot";
export const CHANGE_PASS_ROUTE = "/auth/change-password";
export const RESET_PASS_ROUTE = "/auth/reset-password";
export const DELETE_ACCOUNT_ROUTE = "/auth/delete-profile";

// dashboard
export const GET_DASHBOARD_DATA = "/dashboard";
export const CONTACT_US = "/mailing-list/contact-us";
export const FIND_CANDIDATES = "/candidate/findCandidate";

//candidate
export const GET_MY_JOBS = "/job/candidateJobs";
export const RESUME_ROUTE = "/candidate/resume";
export const UPLOAD_ROUTE = "/candidate/uploads";
export const GET_ALL_VIDEOS = "/candidate/videos";
export const ABOUT_ME_ROUTE = "/candidate/aboutMe";
export const UPDATE_SETTINGS = "/candidate/settings";
export const REPORT_JOB = "/job-reporting/report-job";
export const ADD_COVER_LETTER = "/job/addCoverLetter";
export const REFERENCE_ROUTE = "/candidate/references";
export const EXPERIENCE_ROUTE = "/candidate/experience";
export const CLEAR_PARTNER = "/candidate/clear-partner";
export const ADD_CANDIDATE_NOTE = "/job/addCandidateNote";
export const UPDATE_INTERESTED_JOB = "/job/interestedJobs";
export const UPDATE_PROFILE_LINK = "/candidate/profileLink";
export const UPDATE_MY_JOB_INTERVIEW = "/job/jobInterviews";
export const GET_PROFILE_META_ROUTE = "/candidate/meta-data";
export const PERSONAL_INFO_ROUTE = "/candidate/personalInfo";
export const UPLOAD_VIDEO_INTERVIEW = "/job/myJobInterviews";
export const GET_PROFILE_SECTION_ROUTE = "/candidate/profile";
export const VERIFY_REFERENCE = "/candidate/verifyReferences";
export const GET_MY_VIDEO_INTERVIEW = "/job/myVideoInterviews";
export const AVAILABILITY_ROUTE = "/candidate/availabilityInfo";
export const ADD_VERIFY_REFERENCE = "/candidate/verifyReferences";
export const QUALIFICATION_ROUTE = "/candidate/skillsDriverLicense";
export const CERTIFICATIONS_ROUTE = "/candidate/diplomaCertifications";
export const GET_REFERENCE_DATA_ROUTE = "/candidate/referenceDetails";
export const REQUEST_PARTNER_VERIFICATION = "/candidate/requestPartnerVerification";

export const GET_CANDIDATE_PROFILE = (id, jobId) =>
  `/candidate/profile/${id}${jobId ? "/" + jobId : ""}`;

//employer
export const POST_JOB = "/job/position";
export const GET_ACTIVE_POSTS = "/job/jobsByEmployer";
export const EMPLOYER_SETTINGS = "/employer/settings";
export const DELETE_JOB = (id) => `/job/delete-job/${id}`;
export const UPDATE_A_JOB = (id) => `/job/position/${id}`;
export const EMPLOYER_PERSONAL_DETAIL = "/employer/personalDetails";
export const UPDATE_SHORTLIST_CANDIDATES = "/job/shortListCandidates";
export const GET_ALL_APPLIED_CANDIDATES = "/job/allAppliedCandidates";
export const UPDATE_POSITION_FILLED = (id) => `/job/positionMarked/${id}`;

//job drafts
export const POST_DRAFT = "/job-draft/draft";
export const GET_DRAFT = (id) => `/job-draft/draft/${id}`;
export const UPDATE_A_DRAFT = (id) => `/job-draft/draft/${id}`;
export const DELETE_DRAFT = (id) => `/job-draft/delete-draft/${id}`;
export const GET_DRAFT_BY_EMPLOYER = "/job-draft/jobDraftByEmployer";

//jobs general
export const GET_ALL_JOBS = "/job/position";
export const GET_JOB = (id) => `/job/position/${id}`;

//advertise
export const ADVERTISE_ROUTE = "/advertisers";

export const GET_CITIES = "/utils/cities";

export const COOKIES_ROUTE =
  "https://app.termly.io/api/v1/snippets/websites/9c37cd0b-d72a-4e69-94fb-5119757398af/documents/d7de7933-b0f0-45cf-b27f-0e359997a510/preview";
export const PRIVACY_POLICY_ROUTE =
  "https://app.termly.io/api/v1/snippets/websites/9c37cd0b-d72a-4e69-94fb-5119757398af/documents/c7f2474f-4bdd-4077-95ec-dbfe023a5348/preview";
export const TERMS_CONDITION_ROUTE =
  "https://app.termly.io/api/v1/snippets/websites/9c37cd0b-d72a-4e69-94fb-5119757398af/documents/663ee7fb-1c93-4a0b-b4c7-105991ef7f08/preview";

//Subscription
export const GET_HISTORY = "/subscription/history";
export const GET_INVOICE = "/subscription/invoice";
export const CANCEL_REQUEST = "/subscription/cancel-request";
