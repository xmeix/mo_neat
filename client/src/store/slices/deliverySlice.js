import { createSlice } from "@reduxjs/toolkit";
import {
  addService,
  deleteServices,
  getAllServices,
  updateService,
} from "../apiCalls/service";
import {
  addShippingZone,
  deleteShippingZones,
  getAllShippingZones,
  updateShippingZone,
} from "../apiCalls/shippingZone";

const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    services: [],
    shippingZones: [],
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
    //services
    builder.addCase(getAllServices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllServices.fulfilled, (state, action) => {
      state.loading = false;
      state.services = action.payload.data;
    });

    builder.addCase(getAllServices.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(addService.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addService.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const newService = action.payload.data;
      state.services.push(newService);
    });
    builder.addCase(addService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(deleteServices.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(deleteServices.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const deletedIds = action.payload.data || [];

      state.services = state.services.filter(
        (service) => !deletedIds.includes(service.id)
      );
    });
    builder.addCase(deleteServices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(updateService.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateService.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const updatedService = action.payload.data;
      state.services = state.services.filter(
        (e, i) => e.id !== updatedService.id
      );
      state.services.push(updatedService);

      //TODO:  update all delivery areas where service.id == id , put the new service information in them
    });
    builder.addCase(updateService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    //shippingzones
    builder.addCase(getAllShippingZones.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllShippingZones.fulfilled, (state, action) => {
      state.loading = false;
      state.shippingZones = action.payload.data;
    });

    builder.addCase(getAllShippingZones.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(addShippingZone.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addShippingZone.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const {
        shippingZonesCreated: newShippingZone,
        wilayasCreated,
        wilayasReactivated,
        regionsCreated,
        regionsReactivated,
      } = action.payload.data;
      state.shippingZones.push(newShippingZone);
      //TODO:push created wilayas to the wilayas state
      //TODO:push created regions to the regions state
      //TODO:update wilayas reactivated using id
      //TODO:update regions reactivated using id
    });
    builder.addCase(addShippingZone.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(deleteShippingZones.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(deleteShippingZones.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const deletedIds = action.payload.data || [];

      state.shippingZones = state.shippingZones.filter(
        (shippingZone) => !deletedIds.includes(shippingZone.id)
      );
    });
    builder.addCase(deleteShippingZones.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    builder.addCase(updateShippingZone.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateShippingZone.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const { updatedDeliveryArea, communeReactivated, wilayaReactivated } =
        action.payload.data;
      state.shippingZones = state.services.filter(
        (e, i) => e.id !== updatedDeliveryArea.id
      );
      state.shippingZones.push(updatedDeliveryArea);

      //TODO:  update commune and wilaya Reactivated
    });
    builder.addCase(updateShippingZone.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { reset, resetError, setError } = deliverySlice.actions;
export default deliverySlice.reducer;
