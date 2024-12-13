import { createSlice } from "@reduxjs/toolkit";

import { isWindowDefined } from "utils/helper";

const initialState = {
  user: {},
  role: (isWindowDefined() && localStorage.getItem("role")) || "",
  token: (isWindowDefined() && localStorage.getItem("token")) || "",
  appLoader: false,
  dashboardData: {},
  candidateSearch: {},
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser(state, { payload: { user, token } }) {
      const currentToken = localStorage.getItem("token");
      localStorage.setItem("token", token || currentToken);
      localStorage.setItem("role", user?.type);
      state.user = user;
      state.token = token || currentToken;
      state.role = user?.type;
      state.appLoader = false;
    },
    setLogout(state, { payload = "" }) {
      localStorage.setItem("token", payload);
      localStorage.setItem("role", payload);
      state.user = {};
      state.role = payload;
      state.token = payload;
      state.appLoader = false;
    },
    setAppLoader(state, { payload = false }) {
      state.appLoader = payload;
    },
    setDashboardData(state, { payload }) {
      state.dashboardData = payload;
    },
    setCandidateSearch(state, { payload }) {
      state.candidateSearch = payload;
    },
  },
});
