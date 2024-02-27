import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import authReducer, { initializeAuth } from "./auth/authSlice.ts";
// import { tokenMiddleware } from "../middlewares/tokenMiddleware.ts";

let initializedStore: EnhancedStore | undefined;

// Define the async function to create and initialize the store
export const createAppStore = async () => {
  try {
    const store = configureStore({
      reducer: { auth: authReducer },
    });

    await store.dispatch(initializeAuth());

    initializedStore = store;
    return store;
  } catch (err) {
    console.error("Failed to initialize store:", err);
    throw new Error("Some error occurred");
  }
};

// @ts-ignore
export type RootState = ReturnType<typeof initializedStore.getState>;
// @ts-ignore
export type AppDispatch = typeof initializedStore.dispatch;
