import { createSlice } from "@reduxjs/toolkit";

import {
  addCommune,
  deleteCommune,
  getAllCommunes,
  updateCommune,
} from "../apiCalls/commune";

const communeSlice = createSlice({
  name: "commune",
  initialState: {
    communes: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    reset: (state) => {
      state.communes = null;
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
    builder.addCase(getAllCommunes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllCommunes.fulfilled, (state, action) => {
      state.loading = false;
      state.communes = action.payload.data;
    });

    builder.addCase(getAllCommunes.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    builder.addCase(addCommune.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCommune.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const newCommune = action.payload.data;
      state.communes.push(newCommune);
    });
    builder.addCase(addCommune.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(deleteCommune.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(deleteCommune.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const deletedWilayaId = action.payload.data;

      const communeExists = state.communes.some(
        (commune) => commune.id == deletedWilayaId
      );

      if (communeExists) {
        state.communes = state.communes.filter(
          (commune) => commune.id != deletedWilayaId
        );
      } else {
        console.log("commune with the given ID was not found in the state.");
      }
    });
    builder.addCase(deleteCommune.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(updateCommune.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateCommune.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const updatedCommune = action.payload.data;
      state.communes = state.communes.filter(
        (e, i) => e.id !== updatedCommune.id
      );
      state.communes.push(updatedCommune);
    });
    builder.addCase(updateCommune.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { reset, resetError, setError } = communeSlice.actions;
export default communeSlice.reducer;
