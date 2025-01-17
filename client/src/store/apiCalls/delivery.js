import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const addBatchDTD = createAsyncThunk(
  "batch/dtd",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.admin.post(
        "wilayas/batch/homedelivery",
        body
      );

      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);
export const addBatchDTC = createAsyncThunk(
  "batch/dtc",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.admin.post("wilayas/batch/stopDesk", body);

      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);
