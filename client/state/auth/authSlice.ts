import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signUp } from "../../api/authAPI.ts";
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
interface initialStateTypes {
  signInError: string | null;
  signUpError: string[];
  successMessage: string | null;
}

const initialState: initialStateTypes = {
  signInError: null,
  signUpError: [],
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    CLEAR_MESSAGE: (state) => {
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
        state.successMessage = "Sign up successful"; // or use action.payload for dynamic messages
      })
      .addCase(signUpAction.rejected, (state, action) => {
        state.successMessage = null;
        state.signInError = null;
        // @ts-ignore
        state.signUpError = action.payload ? action.payload : []; // Assuming payload is the error message
      });
  },
});

export const { CLEAR_MESSAGE } = authSlice.actions;

export default authSlice.reducer;
