import { createSlice } from "@reduxjs/toolkit";
import {
  addCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "../apiCalls/coupon";

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    reset: (state) => {
      state.coupons = null;
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
    builder.addCase(getAllCoupons.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllCoupons.fulfilled, (state, action) => {
      state.loading = false;
      state.coupons = action.payload.data;
    });

    builder.addCase(getAllCoupons.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(addCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const newCoupon = action.payload.data;
      state.coupons.push(newCoupon);
    });
    builder.addCase(addCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    builder.addCase(deleteCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(deleteCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const deletedCouponId = action.payload.data;

      const couponExists = state.coupons.some(
        (coupon) => coupon.id == deletedCouponId
      );

      if (couponExists) {
        state.coupons = state.coupons.filter(
          (coupon) => coupon.id != deletedCouponId
        );
      } else {
        console.log("Product with the given ID was not found in the state.");
      }
    });
    builder.addCase(deleteCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(updateCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const updatedCoupon = action.payload.data;
      state.coupons = state.coupons.filter((e, i) => e.id !== updatedCoupon.id);
      state.coupons.push(updatedCoupon);
    });
    builder.addCase(updateCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { reset, resetError, setError } = couponSlice.actions;
export default couponSlice.reducer;
