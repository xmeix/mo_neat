import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import productReducer from "./slices/productSlice.js";
import couponReducer from "./slices/couponSlice.js";
import deliveryReducer from "./slices/deliverySlice.js";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { getAllProducts } from "./apiCalls/product.js";
import { login } from "./apiCalls/auth.js";
import { getAllCoupons } from "./apiCalls/coupon.js";
import { getAllServices } from "./apiCalls/service.js";
import { getAllShippingZones } from "./apiCalls/shippingZone.js";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  coupon: couponReducer,
  delivery: deliveryReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const listenerMiddleware = createListenerMiddleware(); //using for when example, when someone loggs in we get all his events using path on asynch thunk

listenerMiddleware.startListening({
  actionCreator: login.fulfilled,
  effect: async (action, listenerApi) => {
    const { payload } = action;
    console.log("listen ... dispatch products.");
    listenerApi.dispatch(getAllProducts());
    console.log("listen ... dispatch coupons.");
    listenerApi.dispatch(getAllCoupons());
    console.log("listen ... dispatch services.");
    listenerApi.dispatch(getAllServices());
    console.log("listen ... dispatch shipping zones.");
    listenerApi.dispatch(getAllShippingZones());
    /*    console.log("listen ... dispatch wilayas.");
    listenerApi.dispatch(getAllWilayas());
    console.log("listen ... dispatch centers.");
    listenerApi.dispatch(getAllCommunes());*/
  },
});

/*
listenerMiddleware.startListening({
  actionCreator: addBatchDTD.fulfilled,
  effect: async (action, listenerApi) => {
    console.log("listen ... dispatch wilayas.");
    listenerApi.dispatch(getAllWilayas());
    console.log("listen ... dispatch centers.");
    listenerApi.dispatch(getAllCommunes());
  },
});

listenerMiddleware.startListening({
  actionCreator: addBatchDTC.fulfilled,
  effect: async (action, listenerApi) => {
    console.log("listen ... dispatch wilayas.");
    listenerApi.dispatch(getAllWilayas());
    console.log("listen ... dispatch centers.");
    listenerApi.dispatch(getAllCommunes());
    console.log("listen ... dispatch stop desks.");
    listenerApi.dispatch(getAllStopDesks());
  },
});
*/
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);
