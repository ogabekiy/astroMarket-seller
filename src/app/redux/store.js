import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { allApi } from "./api/allApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [allApi.reducerPath]: allApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(allApi.middleware),
});
