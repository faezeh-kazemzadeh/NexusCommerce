import asyncHandler from "express-async-handler";
import _ from "lodash";
import * as categoryService from "../services/category.service.js";

export const getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, all = false } = req.query || {};

  const result = await categoryService.getCategoriesService({
    page,
    limit,
    all,
  });

  res.status(200).json({
    success: true,
    categories: result.categories,
    pagination: result.pagination,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const data = _.pick(req.body, ["name", "description", "parentCategory"]);
  const category = await categoryService.createCategoryService(data);
  res.status(201).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const data = _.pick(req.body, ["name", "description", "parentCategory"]);
  const category = await categoryService.updateCategoryService(
    req.params.id,
    data,
  );
  res.status(200).json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategoryService(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
});
