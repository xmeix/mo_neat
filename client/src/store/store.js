import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import productReducer from "./slices/productSlice.js";
import couponReducer from "./slices/couponSlice.js";
import geoReducer from "./slices/geoSlice.js";
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
import { getAllWilayas } from "./apiCalls/wilaya.js";
import { getAllCommunes } from "./apiCalls/commune.js";
import { addBatchDTC, addBatchDTD } from "./apiCalls/delivery.js";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  coupon: couponReducer,
  geo: geoReducer,
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
    console.log("listen ... dispatch wilayas.");
    listenerApi.dispatch(getAllWilayas());
    console.log("listen ... dispatch centers.");
    listenerApi.dispatch(getAllCommunes());
  },
});

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
