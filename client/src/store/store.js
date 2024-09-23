import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import productReducer from "./slices/productSlice.js";
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

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const listenerMiddleware = createListenerMiddleware(); //using for when example, when someone loggs in we get all his events using path on asynch thunk

listenerMiddleware.startListening({
  actionCreator: login.fulfilled,
  effect: async (action, listenerApi) => {
    const { payload } = action;
    console.log("listen ... dispatch products.");
    listenerApi.dispatch(getAllProducts());
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
