import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signUp as signUpService,
  signIn as signInService,
  updateProfile as updateProfileService,
  signOut as signOutService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from "../services/authService";

const initialState = {
  currentUser: null,
  error: null,
  isLoading: false,
  successMessage: null,
  profileUpdating: false,
};

// --- Async Thunks ---
export const signIn = createAsyncThunk(
  "auth/signin",
  async (credential, { rejectWithValue }) => {
    try {
      const data = await signInService(credential);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Sign in failed");
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await signUpService(userData);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Sign up failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/profile",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await updateProfileService(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed",
      );
    }
  },
);

export const signOut = createAsyncThunk(
  "auth/signout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await signOutService();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // dispatch(authSlice.actions.clearAuth());
      return { message: "Logout successful." };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Sign out failed",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordService(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Forgot password failed",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Resetting password with credentials:", credentials);
      const response = await resetPasswordService(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Reset password failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.error = null;
      state.isLoading = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SignIn
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.successMessage = action.payload.message || "Login successful.";
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
        state.error = action.payload;
        state.successMessage = null;
      })
      // SignUp
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.successMessage =
          action.payload.message || "Registration successful.";
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
        state.error = action.payload;
        state.successMessage = null;
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.profileUpdating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileUpdating = false;
        state.currentUser = action.payload.user;
        state.successMessage = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileUpdating = false;
        state.error = action.payload;
      })
      // signOut
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(signOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
        state.error = null;
        state.successMessage = action.payload.message || "Logout successful";
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.successMessage = null;
        state.currentUser = null;
      })
      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.successMessage =
          action.payload.message || "Password reset link sent to your email.";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.successMessage =
          action.payload.message ||
          "Your password has been reset successfully. Please log in.";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.successMessage = null;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
