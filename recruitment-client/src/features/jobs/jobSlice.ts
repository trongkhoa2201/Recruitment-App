import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/jobAPI";

interface FetchJobsParams {
  search?: string;
}

export const getJobs = createAsyncThunk(
  "jobs/fetchAll",
  async (params: FetchJobsParams = {}) => {
    const res = await api.fetchJobs(params);
    return res.data;
  }
);


const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default jobSlice.reducer;
