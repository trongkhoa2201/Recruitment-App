import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "../features/jobs/jobSlice";
import jobLogReducer from "../features/jobs/jobLogSlice";

const store = configureStore({
  reducer: {
    jobs: jobReducer,
    jobLog: jobLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
