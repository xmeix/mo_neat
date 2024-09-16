import { createSlice } from "@reduxjs/toolkit";
import { login, logout, register } from "../apiCalls/auth";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    reset: (state) => {
      state.isLoggedIn = false;
      state.error = null;
      state.loading = false;
      state.success = null;
    },
    setError: (state, action) => {
      console.log(action.payload);
      state.error = action.payload.message;
      state.success = null;
    },
    resetError: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // normal login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.isLoggedIn = true;
      state.user = action.payload.data;
      state.success = action.payload.message;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload.message;
      state.loading = false;
      state.isLoggedIn = false;
      state.user = null;
      //   state.token = null;
    });
    // register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.payload.message;
      state.loading = false;
    });
    // logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.user = null;
      state.success = action.payload.message;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload.message;
      state.loading = false;
      state.isLoggedIn = false;
      state.user = null;
      //   state.token = null;
    });
  },
});

export const { reset, resetError, setError } = authSlice.actions;
export default authSlice.reducer;
