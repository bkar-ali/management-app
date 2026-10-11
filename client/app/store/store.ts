import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "../features/auth/globalSlice";
import { api } from "./api";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
