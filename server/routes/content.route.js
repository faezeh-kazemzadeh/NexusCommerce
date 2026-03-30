import express from "express";
import { createContent } from "../controllers/content.controller.js";
import { contentUpload } from "../middleware/contentUpload.middleware.js";
import { verifyToken, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

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
