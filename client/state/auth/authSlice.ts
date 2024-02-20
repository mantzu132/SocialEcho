import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn, signUp } from "../../api/authAPI.ts";
import { NavigateFunction } from "react-router-dom";

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

interface initialStateTypes {
  signInError: string | null;
  signUpError: string[];
  successMessage: string | null;
  userData: {
    user: string;
    accessToken: string;
    refreshToken: string;
    accessTokenUpdatedAt: string;
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
    CLEAR_MESSAGES: (state) => {
      state.successMessage = null;
      state.signInError = null;
      state.signUpError = [];
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
      });
  },
});

export const { CLEAR_MESSAGES } = authSlice.actions;

export default authSlice.reducer;
