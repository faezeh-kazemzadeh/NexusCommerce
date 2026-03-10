import api from "../../../core/services/apiClient";
import { apiWrapper } from "../../../core/services/apiWrapper";

export const signIn = (credential) =>
  apiWrapper(() => api.post("/auth/signin", credential));

export const signUp = (credential) =>
  apiWrapper(() => api.post("/auth/signup", credential));

export const signOut = () => apiWrapper(() => api.post("/auth/signout"));

export const updateProfile = (credentials) =>
  apiWrapper(() => api.put("/auth/profile", credentials));

export const forgotPassword = (email) =>
  apiWrapper(() => api.post("/auth/forgot-password", { email }));

export const resetPassword = (credentials) => {
  const { token, newPassword } = credentials;
  return apiWrapper(() =>
    api.put(`/auth/reset-password/${token}`, { password: newPassword }),
  );
};

export const validateToken = (token) =>
  apiWrapper(() => api.get(`/auth/validate-token/${token}`));
