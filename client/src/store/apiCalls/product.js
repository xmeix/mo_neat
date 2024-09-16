import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const getAllProducts = createAsyncThunk(
  "products",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.public.get("products");
      console.log(res);
      return res;
    } catch (error) {
      console.error(error || "Something went wrong");
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const addProduct = createAsyncThunk(
  "products",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.admin.post("products", body);
      return res;
    } catch (error) {
      console.error(error || "Something went wrong");
      return rejectWithValue(error || "Something went wrong");
    }
  }
);
