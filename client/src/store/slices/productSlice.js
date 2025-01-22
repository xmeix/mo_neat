import { createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../apiCalls/product";
import { initData } from "../../assets/data/formInitData";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    drawerType: null,
    formData: initData,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    reset: (state) => {
      state.products = null;
      state.error = null;
      state.loading = false;
      state.success = null;
      state.formData = initData;
      state.drawerType = null;
    },
    setError: (state, action) => {
      state.error = action.payload.message || action.payload;
      state.success = null;
    },
    resetError: (state) => {
      state.error = null;
      state.success = null;
    },
    setFormData(state, action) {
      state.formData = action.payload;
    },
    setDrawerType(state, action) {
      state.drawerType = action.payload;
    },
    resetState(state) {
      state.formData = initData;
      state.drawerType = null;
    },
    resetFormData(state) {
      state.formData = initData;
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
    });

    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const newProduct = action.payload.data;
      state.products.push(newProduct);
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const deletedProductId = action.payload.data;

      const productExists = state.products.some(
        (product) => product.id == deletedProductId
      );

      if (productExists) {
        state.products = state.products.filter(
          (product) => product.id != deletedProductId
        );
      } else {
        console.log("Product with the given ID was not found in the state.");
      }
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const updatedProduct = action.payload.data;
      state.products = state.products.filter(
        (e, i) => e.id !== updatedProduct.id
      );
      state.products.push(updatedProduct);
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const {
  reset,
  resetError,
  setError,
  setDrawerType,
  resetFormData,
  setFormData,
} = productSlice.actions;
export default productSlice.reducer;
