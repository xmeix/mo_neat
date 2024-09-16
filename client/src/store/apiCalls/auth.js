import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

export const login = createAsyncThunk("auth/login", async (body, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await apiService.public.post("auth/login", body);
    return res;
  } catch (error) {
    console.error(error || "Something went wrong");
    return rejectWithValue(error || "Something went wrong");
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (body, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await apiService.public.post("auth/register", body);
      return res;
    } catch (error) {
      console.error(error || "Something went wrong");
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await apiService.public.post("auth/logout");
    return res;
  } catch (error) {
    console.error(error || "Something went wrong");
    return rejectWithValue(error || "Something went wrong");
  }
});
