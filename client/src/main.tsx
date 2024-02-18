import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import { Provider } from "react-redux";
import { store } from "../state/store.ts";
import SignUp from "./pages/SignUp.tsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/signup", element: <SignUp /> },
  { path: "*", element: "404 Not Found" },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
