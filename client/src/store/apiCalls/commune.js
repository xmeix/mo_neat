import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const getAllCommunes = createAsyncThunk(
  "wilayas/communes",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.public.get("wilayas/communes");
      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const addCommune = createAsyncThunk(
  "wilayas/communes/add",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log(body);
      const res = await apiService.admin.post("wilayas/communes", body);

      return res;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);
export const deleteCommune = createAsyncThunk(
  "wilayas/communes/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiService.admin.delete(
        `wilayas/communes/${productId}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCommune = createAsyncThunk(
  "wilayas/communes/update",
  async ({ body, id }, { rejectWithValue }) => {
    try {
      console.log(body);
      const response = await apiService.admin.patch(
        `wilayas/communes/${id}`,
        body
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
