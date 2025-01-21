import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const getAllServices = createAsyncThunk(
  "services",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.admin.get("deliveryService");
      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const addService = createAsyncThunk(
  "services/add",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.admin.post("deliveryService", body);

      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const deleteServices = createAsyncThunk(
  "services/delete",
  async (body, { rejectWithValue }) => {
    try {
      const response = await apiService.admin.delete(
        `deliveryService/deleteAll`,
        body
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateService = createAsyncThunk(
  "services/update",
  async ({ body, id }, { rejectWithValue }) => {
    try {
      const response = await apiService.admin.patch(
        `deliveryService/${id}`,
        body
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
