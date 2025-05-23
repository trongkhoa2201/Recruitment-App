import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchJobLogsAPI } from "../../api/jobLogAPI";

interface JobLog {
  _id: string;
  action: string;
  description: string;
  timestamp: string;
}

interface JobLogState {
  logs: JobLog[];
  loading: boolean;
  error: string | null;
}

const initialState: JobLogState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchJobLogs = createAsyncThunk<
  JobLog[],
  void,
  { rejectValue: string }
>("jobLog/fetch", async (_, thunkAPI) => {
  try {
    const response = await fetchJobLogsAPI();
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch job logs"
    );
  }
});

const jobLogSlice = createSlice({
  name: "jobLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJobLogs.fulfilled,
        (state, action: PayloadAction<JobLog[]>) => {
          state.loading = false;
          state.logs = action.payload;
        }
      )
      .addCase(fetchJobLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export default jobLogSlice.reducer;
