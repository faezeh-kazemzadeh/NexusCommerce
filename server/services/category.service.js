import { Category } from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";

export const getCategoriesService = async ({
  page = 1,
  limit = 10,
  all = false,
} = {}) => {
  if (all === "true" || all === true) {
    const categories = await Category.find()
      .select("name _id parent")
      .sort({ name: 1 })
      .lean();
    return { categories };
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);

  const totalCategories = await Category.countDocuments();
  const categories = await Category.find()
    .populate("parent", "name")
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .lean();

  return {
    categories,
    pagination: {
      totalItems: totalCategories,
      totalPages: Math.ceil(totalCategories / limitNumber),
      currentPage: pageNumber,
    },
  };
};

export const createCategoryService = async (data) => {
  const existing = await Category.findOne({ name: data.name });
  if (existing) throw errorHandler(400, "Category already exists");

  const newCategory = new Category(data);
  return await newCategory.save();
};

export const updateCategoryService = async (id, updateData) => {
  const category = await Category.findById(id);
  if (!category) throw errorHandler(404, "Category not found");

  if (updateData.parent && updateData.parent === id) {
    throw errorHandler(400, "A category cannot be its own parent");
  }

  if (updateData.name) category.name = updateData.name;
  if (updateData.description !== undefined)
    category.description = updateData.description;
  if (updateData.parent !== undefined) category.parent = updateData.parent;

  return await category.save();
};

export const deleteCategoryService = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw errorHandler(404, "Category not found");

  const hasSubCategories = await Category.findOne({ parent: id });
  if (hasSubCategories) {
    throw errorHandler(400, "Cannot delete category that has sub-categories");
  }

  if (category.postCount > 0) {
    throw errorHandler(400, "Cannot delete category linked to posts");
  }

  return await Category.findByIdAndDelete(id);
};
