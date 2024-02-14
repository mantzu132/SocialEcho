import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import { Provider } from "react-redux";
import { store } from "../state/store.ts";
import Moderator from "./pages/Moderator.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SignupForm from "../components/auth/SignupForm.tsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/community", element: <CommunityPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/signup", element: <SignupForm /> },
  { path: "/community/:id", element: <CommunityPage /> },
  { path: "/community/moderator", element: <Moderator /> },
  { path: "*", element: "404 Not Found" },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
