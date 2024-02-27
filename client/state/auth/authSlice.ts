import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn, signUp } from "../../api/authAPI.ts";
import { NavigateFunction } from "react-router-dom";
import { isValidToken } from "../../src/utils/authUtils.ts";
import { RootState } from "../store.ts";
import { API } from "../../api/utils.ts";

interface SignUpActionParams {
  formData: FormData;
  navigate: NavigateFunction;
}
export const signUpAction = createAsyncThunk<
  any,
  SignUpActionParams,
  { rejectValue: string }
>("auth/signUp", async ({ formData, navigate }, { rejectWithValue }) => {
  try {
    localStorage.removeItem("profile");
    const response = await signUp(formData);
    const { error } = response;

    if (error) {
      return rejectWithValue(error);
    } else {
      navigate("/signin");
      return response.data;
    }
  } catch (error) {
    // @ts-ignore
    return rejectWithValue(error.response.data);
  }
});

interface SignInActionParams {
  formData: FormData;
  navigate: NavigateFunction;
}
export const signInAction = createAsyncThunk<
  any,
  SignInActionParams,
  { rejectValue: string }
>("auth/signIn", async ({ formData, navigate }, { rejectWithValue }) => {
  try {
    const response = await signIn(formData);
    const { error } = response;

    if (error) {
      return rejectWithValue(error);
    } else {
      const { user, accessToken, refreshToken, accessTokenUpdatedAt } =
        response.data;

      const profile = {
        user,
        accessToken,
        refreshToken,
        accessTokenUpdatedAt,
      };

      localStorage.setItem("profile", JSON.stringify(profile));
      navigate("/");
      return profile;
    }
  } catch (error) {
    // @ts-ignore
    return rejectWithValue(error.response.data);
  }
});

export const logoutAction = createAsyncThunk<void>("auth/logout", async () => {
  localStorage.removeItem("profile");
  return;
});

export const refreshTokenAction = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await API.post("/users/refresh-token", { refreshToken });
      const profile = JSON.parse(localStorage.getItem("profile") || "{}");
      const payload = response.data;

      localStorage.setItem(
        "profile",
        JSON.stringify({ ...profile, ...payload }),
      );

      return payload; // This will be handled in the fulfilled reducer
    } catch (error) {
      localStorage.removeItem("profile");
      // @ts-ignore
      return rejectWithValue(error.response.data); // This will be handled in the rejected reducer
    }
  },
);

export const initializeAuth = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("auth/initializeAuth", async (_, { dispatch }) => {
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const { accessToken, refreshToken, user } = profile;

  if (accessToken && refreshToken) {
    if (isValidToken(accessToken)) {
      dispatch(setAccessToken(accessToken));
      dispatch(setRefreshToken(refreshToken));
      dispatch(setUserData(user));
    } else {
      await dispatch(refreshTokenAction(refreshToken));
    }
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface initialStateTypes {
  signInError: string | null;
  signUpError: string[];
  successMessage: string | null;
  userData: {
    user: string;
    _id: string;
    email: string;
    role: string;
    avatar: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: initialStateTypes = {
  signInError: null,
  signUpError: [],
  successMessage: null,
  userData: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.signInError = null;
      state.signUpError = [];
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setUserData(state, action) {
      state.userData = action.payload;
    },
    refreshTokenFailed(state) {
      state.userData = null;
      state.refreshToken = null;
      state.accessToken = null;
      state.signUpError = [];
      state.signInError = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signUpAction.fulfilled, (state) => {
        state.signInError = null;
        state.signUpError = [];
        // @ts-ignore
        state.successMessage = "Sign up successful";
      })
      .addCase(signUpAction.rejected, (state, action) => {
        state.signInError = action.payload ? action.payload : null;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.successMessage = "Successfully Logged In !";
        state.signInError = null;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userData = action.payload.user;
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.successMessage = null;
        state.signUpError = [];
        state.signInError = action.payload ? action.payload : null;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.signInError = null;
        state.signUpError = [];
        state.successMessage = null;
        state.userData = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.accessToken = action.payload ? action.payload.accessToken : null;
        state.refreshToken = action.payload
          ? action.payload.refreshToken
          : null;
      });
  },
});

export const {
  clearMessages,
  setRefreshToken,
  setAccessToken,
  setUserData,
  refreshTokenFailed,
  refreshTokenSuccess,
} = authSlice.actions;

export default authSlice.reducer;
