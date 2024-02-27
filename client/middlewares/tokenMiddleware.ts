import { refreshTokenAction } from "../state/auth/authSlice";
import { jwtDecode } from "jwt-decode";

// this middleware runs before getting to the reducer if a dispatched action requires authentication (has meta.requiresAuth = true set)
// it checks if the access token is still valid and refreshes it its about to expire or if its expired.
// this deals only with the expiration of the accesstoken and not it's validity (we deal with that on server)
// it also gets the token from state not localStorage.
// it also doesn't update anything related to the tokens, refreshTokenAction does that.

export const tokenMiddleware = (store) => (next) => async (action) => {
  if (action.meta && action.meta.requiresAuth) {
    const state = store.getState();
    const token = state.auth?.accessToken;
    if (token) {
      // @ts-ignore
      const expiresIn = jwtDecode(token).exp * 1000 - Date.now();
      if (expiresIn < 1800000) {
        const refreshToken = state.auth.refreshToken;
        try {
          await store.dispatch(refreshTokenAction(refreshToken));
          const newToken = store.getState().auth.accessToken;
          if (!newToken) {
            throw new Error("Access token not found after refresh");
          }
        } catch (error) {
          store.dispatch({ type: "LOGOUT" });
        }
      }
    } else {
      store.dispatch({ type: "LOGOUT" });
    }
  }
  return next(action);
};
