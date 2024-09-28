import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const getAllCoupons = createAsyncThunk(
  "coupons",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.public.get("coupons");
      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const addCoupon = createAsyncThunk(
  "coupons/add",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log(body);
      const res = await apiService.admin.post("coupons", body);

      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiService.admin.delete(`coupons/${productId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupons/update",
  async ({ body, id }, { rejectWithValue }) => {
    try {
      console.log(body);
      const response = await apiService.admin.patch(`coupons/${id}`, body);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
