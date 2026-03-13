import api from "../../../core/services/apiClient";
import { apiWrapper } from "../../../core/services/apiWrapper";

export const getTags = ({
  search = "",
  page = 1,
  limit = 10,
  sort = "createdAt",
}) =>
  apiWrapper(() =>
    api.get("/tags", {
      params: { search, page, limit, sort },
    }),
  );

export const createTag = (tagData) =>
  apiWrapper(() => api.post("/tags", tagData));

export const updateTag = ({ id, tagData }) =>
  apiWrapper(() => api.put(`/tags/${id}`, { ...tagData }));

export const deleteTag = (id) => apiWrapper(() => api.delete(`/tags/${id}`));
