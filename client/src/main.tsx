import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import { Provider } from "react-redux";
import { store } from "../state/store.ts";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/community", element: <CommunityPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
