import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initialStateTypes, logoutAction } from "./state/auth/authSlice";
import { ReactNode, useEffect } from "react";
import { AppDispatch, RootState } from "./state/store.ts";
import Navbar from "./shared/Navbar.tsx";

interface PrivateRouteProps {
  children: ReactNode;
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const userData = useSelector((state: RootState) => state.auth.userData);

  // TODO: IMPLEMENT THE NAVBAR WITH THE USERS
  const isAuthenticated = (
    userData: initialStateTypes["userData"] | null, // from state
    accessToken: string | null, // from local storage
  ) => {
    return !!userData && !!accessToken;
  };

  const profile = localStorage.getItem("profile");
  let accessToken: string | null = null;
  if (profile) {
    accessToken = JSON.parse(profile)?.accessToken;
  }

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isAuthenticated(userData, accessToken)) {
      dispatch(logoutAction()).then(() => {
        navigate("/signin");
      });
    }
  }, [dispatch, navigate, userData, accessToken, isAuthenticated]);

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default PrivateRoute;
