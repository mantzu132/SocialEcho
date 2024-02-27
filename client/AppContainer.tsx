import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes.tsx";
import { Provider } from "react-redux";
import { createAppStore } from "./state/store.ts";
import { useEffect, useState } from "react";
import { EnhancedStore } from "@reduxjs/toolkit";

const AppContainer = () => {
  const router = createBrowserRouter([...privateRoutes, ...publicRoutes]);
  const [store, setStore] = useState<EnhancedStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStore = async () => {
      try {
        const appStore = await createAppStore();
        setStore(appStore);
      } catch (err) {
        // @ts-ignore
        setError(`Error initializing the app: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeStore();
  }, []);

  if (loading || error || store === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        LOADING !!!
      </div>
    );
  }

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default AppContainer;
