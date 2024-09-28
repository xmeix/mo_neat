import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const getAllProducts = createAsyncThunk(
  "products",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.public.get("products");
      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log(body);
      const res = await apiService.admin.post("products", body);

      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiService.admin.delete(`products/${productId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ body, id }, { rejectWithValue }) => {
    try {
      console.log(body);
      const response = await apiService.admin.patch(`products/${id}`, body);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
