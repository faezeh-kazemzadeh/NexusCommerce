import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
const noRetryUrls = ["/auth/signin", "/auth/signup", "/auth/signout"];
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    config.shouldRetry = !noRetryUrls.includes(config.url);
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.shouldRetry
    ) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh-token");
        if (!res?.data) return;
        return api(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 403) {
      console.error(
        "Access Denied: You don't have permission for this action.",
      );
      window.location.href = "/unauthorized";
    }
    return Promise.reject(error);
  },
);
export default api;
export const setBaseURL = (url) => {
  api.defaults.baseURL = url;
};
