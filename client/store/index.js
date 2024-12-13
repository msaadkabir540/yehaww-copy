import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import { appSlice } from "./app-splice";

const makeStore = () =>
  configureStore({
    reducer: { app: appSlice.reducer },
  });

export const { setUser, setLogout, setAppLoader, setDashboardData, setCandidateSearch } =
  appSlice.actions;

export const wrapper = createWrapper(makeStore);
