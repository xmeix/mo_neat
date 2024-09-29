import { createSlice } from "@reduxjs/toolkit";
import { addWilaya, deleteWilaya, getAllWilayas, updateWilaya } from "../apiCalls/wilaya";
 

const wilayaSlice = createSlice({
  name: "wilaya",
  initialState: {
    wilayas: [],
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
    builder.addCase(getAllWilayas.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllWilayas.fulfilled, (state, action) => {
      state.loading = false;
      state.wilayas = action.payload.data;
    });

    builder.addCase(getAllWilayas.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
     });

    builder.addCase(addWilaya.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addWilaya.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const newWilaya = action.payload.data;
      state.wilayas.push(newWilaya);
    });
    builder.addCase(addWilaya.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(deleteWilaya.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(deleteWilaya.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const deletedWilayaId = action.payload.data;

      const wilayaExists = state.wilayas.some(
        (wilaya) => wilaya.id == deletedWilayaId
      );

      if (wilayaExists) {
        state.wilayas = state.wilayas.filter(
          (wilaya) => wilaya.id != deletedWilayaId
        );
      } else {
        console.log("wilaya with the given ID was not found in the state.");
      }
    });
    builder.addCase(deleteWilaya.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(updateWilaya.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateWilaya.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const updatedWilaya = action.payload.data;
      state.wilayas = state.wilayas.filter(
        (e, i) => e.id !== updatedWilaya.id
      );
      state.wilayas.push(updatedWilaya);
    });
    builder.addCase(updateWilaya.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { reset, resetError, setError } = wilayaSlice.actions;
export default wilayaSlice.reducer;
