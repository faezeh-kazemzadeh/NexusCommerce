import express from "express";
import { Tag } from "../models/tag.model.js";
import { validate } from "../middleware/validate.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import {
  getTags,
  addTag,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";

const router = express.Router();

/**
 * @route   GET /api/tags
 * @desc    Get all tags
 * @access  Public
 */
router.get("/", getTags);

// All routes below require authentication and admin role
router.use(verifyToken, authorize(["admin"]));

/**
 * @route   POST /api/tags
 * @desc    Create a new tag
 */
router.post("/", validate(Tag.validateTag), addTag);

/**
 * @route   PUT/DELETE /api/tags/:id
 * @desc    Update or Delete a tag
 */
router
  .route("/:id")
  .put(validate(Tag.validateTag), updateTag)
  .delete(deleteTag);

export default router;
