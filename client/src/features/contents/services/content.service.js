import api from "../../../core/services/apiClient";
import { apiWrapper } from "../../../core/services/apiWrapper";

export const getContents = ({
  page = 1,
  limit = 10,
  search = "",
  type = "",
  status = "",
  category = "",
}) =>
  apiWrapper(() =>
    api.get("/content", {
      params: { page, limit, search, type, status, category },
    }),
  );

export const createContent = (formData, type) =>
  apiWrapper(() =>
    api.post(`/content?type=${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
