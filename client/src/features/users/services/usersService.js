import api from "../../../core/services/apiClient";
import { apiWrapper } from "../../../core/services/apiWrapper";

export const getAllUsers = ({ status, search = "", page = 1, limit = 4 }) =>
  apiWrapper(() =>
    api.get("/users", {
      params: { status, search, page, limit },
    }),
  );

export const updateUser = (userId, userData) =>
  apiWrapper(() => api.patch(`/users/${userId}`, userData));

export const updateUserStatus = (userId, action) =>
  apiWrapper(() => api.patch(`/users/${userId}/status`, { action }));
