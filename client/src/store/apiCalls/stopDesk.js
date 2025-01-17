import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const getAllWilayas = createAsyncThunk(
  "stopdesks",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.public.get("wilayas");
      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const addWilaya = createAsyncThunk(
  "stopdesks/add",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.admin.post("wilayas", body);

      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);
export const deleteWilaya = createAsyncThunk(
  "stopdesks/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiService.admin.delete(`wilayas/${productId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWilaya = createAsyncThunk(
  "stopdesks/update",
  async ({ body, id }, { rejectWithValue }) => {
    try {
      console.log(body);
      const response = await apiService.admin.patch(`wilayas/${id}`, body);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
