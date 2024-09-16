import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts } from "../apiCalls/product";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    reset: (state) => {
      state.products = null;
      state.error = null;
      state.loading = false;
      state.success = null;
    },
    setError: (state, action) => {
      state.error = action.payload.message;
      state.success = null;
    },
    resetError: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.data;
      state.success = action.payload.message;
    });

    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.isLoggedIn = false;
    });
  },
});

export const { reset, resetError, setError } = productSlice.actions;
export default productSlice.reducer;
