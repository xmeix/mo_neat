import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const getAllShippingZones = createAsyncThunk(
  "shippingZones",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.admin.get("shippingZone");
      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const addShippingZone = createAsyncThunk(
  "shippingZones/add",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.admin.post("shippingZone", body);

      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const deleteShippingZones = createAsyncThunk(
  "shippingZones/delete",
  async (body, { rejectWithValue }) => {
    try {
      const response = await apiService.admin.delete(
        `shippingZone/deleteAll`,
        body
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateShippingZone = createAsyncThunk(
  "shippingZones/update",
  async ({ body, id }, { rejectWithValue }) => {
    try {
      const response = await apiService.admin.patch(`shippingZone/${id}`, body);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
