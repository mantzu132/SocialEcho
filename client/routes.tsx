import SignIn from "./src/pages/SignIn.tsx";
import HomePage from "./src/pages/HomePage.tsx";
import SignUp from "./src/pages/SignUp";
import PrivateRoute from "./PrivateRoute.tsx";

export const privateRoutes = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <HomePage />
      </PrivateRoute>
    ),
  },
];
export const publicRoutes = [
  { path: "/signup", element: <SignUp /> },
  { path: "*", element: "404 Not Found" },
  { path: "/signin", element: <SignIn /> },
];
