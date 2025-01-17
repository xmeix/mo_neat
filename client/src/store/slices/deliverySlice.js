import { createSlice } from "@reduxjs/toolkit";
import { addBatchDTC, addBatchDTD } from "../apiCalls/delivery";

const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    wilayas: [],
    communes: [],
    stopDesks: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    reset: (state) => {
      state.wilayas = null;
      state.error = null;
      state.loading = false;
      state.success = null;
    },
    setError: (state, action) => {
      state.error = action.payload.message || action.payload;
      state.success = null;
    },
    resetError: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBatchDTD.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBatchDTD.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    });
    builder.addCase(addBatchDTD.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    builder.addCase(addBatchDTC.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBatchDTC.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    });
    builder.addCase(addBatchDTC.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { reset, resetError, setError } = deliverySlice.actions;
export default deliverySlice.reducer;
