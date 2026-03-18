import api from "../../../core/services/apiClient";
import { apiWrapper } from "../../../core/services/apiWrapper";

export const getCategories = ({ page = 1, limit = 10, all = false }) =>
  apiWrapper(() =>
    api.get("/categories", {
      params: { page, limit, all },
    }),
  );

export const createCategory = (categoryData) =>
  apiWrapper(() => api.post("/categories", categoryData));

export const updateCategory = ({ id, categoryData }) =>
  apiWrapper(() => api.put(`/categories/${id}`, { ...categoryData }));

export const deleteCategory = (id) =>
  apiWrapper(() => api.delete(`/categories/${id}`));
