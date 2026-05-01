import express from "express";
import {
  createContent,
  getContents,
} from "../controllers/content.controller.js";
import { contentUpload } from "../middleware/contentUpload.middleware.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import { canAccessResource } from "../middleware/canAccessResource.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/content
 * @desc    Get all contents
 * @access  Public
 */
router.get("/", getContents);

// All content creation routes require authentication
router.use(verifyToken);

/**
 * @route   POST /api/content
 * @desc    Create new content with media upload
 * @access  Private
 */
router.post(
  "/",
  authorize(["admin", "moderator", "author"]),
  contentUpload,
  createContent,
);

export default router;
