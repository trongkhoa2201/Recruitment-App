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

export const deleteJob = createAsyncThunk("jobs/delete", async (id: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await api.deleteJob(id, config);
  return id;
});

export const deleteJobsBulk = createAsyncThunk<
  string[],
  string[],
  { rejectValue: string }
>("jobs/deleteBulk", async (ids, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  if (!token) return rejectWithValue("No token found");

  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await api.deleteJobBulk("/api/jobs/delete-bulk", { ids }, config);
    return ids; // Trả về danh sách ID để cập nhật lại Redux state
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete jobs"
    );
  }
});

export const createJob = createAsyncThunk(
  "jobs/create",
  async (jobData: any) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const res = await api.createJob(jobData, token);
    return res.data;
  }
);

export const updateJob = createAsyncThunk(
  "jobs/update",
  async ({ id, data }: { id: string; data: any }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await api.updateJob(id, data, config);
    return res.data;
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    items: [] as any[],
    loading: false,
    error: null as string | null,
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
        state.error = action.error.message || null;
      })
      .addCase(deleteJobsBulk.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (job) => !action.payload.includes(job._id)
        );
      })
      .addCase(deleteJobsBulk.rejected, (state, action) => {
        state.error = action.payload || "Delete bulk failed";
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((job) => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.error = action.error.message || null;
      })

      .addCase(createJob.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.error = action.error.message || null;
      })

      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.error = action.error.message || null;
      });
  },
});

export default jobSlice.reducer;
