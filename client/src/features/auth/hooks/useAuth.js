import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  signIn,
  signUp,
  signOut,
  forgotPassword,
  resetPassword,
  updateProfile,
  clearAuth,
} from "../redux/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, error, isLoading, successMessage, profileUpdating } =
    useSelector((state) => state.auth);

  const isAuthenticated = !!currentUser;
  const userId = currentUser?.id || currentUser?._id || null;

  const authStatus = isLoading
    ? "loading"
    : error
      ? "failed"
      : successMessage
        ? "succeeded"
        : "idle";
  const authError = error?.message || error || null;
  const authSuccessMessage = successMessage || null;

  const login = useCallback(
    async (credentials) => {
      const result = await dispatch(signIn(credentials)).unwrap();

      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
      return result;
    },
    [dispatch, navigate, location],
  );

  const logout = useCallback(async () => {
    await dispatch(signOut());
    dispatch(clearAuth());
    navigate("/signin", { replace: true });
  }, [dispatch]);

  const resetUserPassword = useCallback(
    async (credentials) => {
      const payload = {
        token: credentials.token,
        newPassword: credentials.newPassword,
      };
      return await dispatch(resetPassword(payload)).unwrap();
    },
    [dispatch],
  );

  const updateMyProfile = useCallback(
    async (payload) => {
      return await dispatch(updateProfile(payload)).unwrap();
    },
    [dispatch],
  );

  const clearAuthMessages = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    currentUser,
    isAuthenticated,
    userId,
    isLoading,
    authStatus,
    authError,
    authSuccessMessage,
    login,
    register: (creds) => dispatch(signUp(creds)).unwrap(),
    logout,
    requestPasswordResetLink: (email) =>
      dispatch(forgotPassword(email)).unwrap(),
    resetUserPassword,
    updateMyProfile,
    clearAuthMessages,
    profileUpdating,
  };
};

export default useAuth;
