import express from "express";
import { Category } from "../models/category.model.js";
import { validate } from "../middleware/validate.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get categories (paginated or all)
 * @access  Public
 */
router.get("/", getCategories);

// All routes below require authentication and admin role
router.use(verifyToken, authorize(["admin"]));

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 */
router.post("/", validate(Category.validateCategory), createCategory);

/**
 * @route   PUT/DELETE /api/categories/:id
 * @desc    Update or Delete a category
 */
router
  .route("/:id")
  .put(validate(Category.validateCategory), updateCategory)
  .delete(deleteCategory);

export default router;
