import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { uploadSingle, uploadArray } from "../middleware/upload.middleware.js";
import {
  uploadSingleMedia,
  uploadMultipleMedia,
  deleteMedia,
  deleteMultipleMedia,
  getMediaList,
} from "../controllers/media.controller.js";
import { canAccessResource } from "../middleware/canAccessResource.middleware.js";
import { Media } from "../models/media.model.js";
const router = express.Router();

// All media upload routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/media
 * @desc    Get a paginated list of media files with optional filtering
 * @access  Private
 */
router.get("/", getMediaList);

/**
 * @route   POST /api/media/upload-single
 * @desc    Upload a single media file
 * @access  Private
 */
router.post("/upload-single", uploadSingle, uploadSingleMedia);

/**
 * @route   POST /api/media/upload-multiple
 * @desc    Upload multiple media files
 * @access  Private
 */
router.post("/upload-multiple", uploadArray, uploadMultipleMedia);

/**
 * @route   DELETE /api/media/delete-multiple
 * @desc    Delete multiple media files by IDs
 * @access  Private
 */
router.delete("/delete-multiple", deleteMultipleMedia);

/**
 * @route   DELETE /api/media/:id
 * @desc    Delete a media file by ID
 * @access  Private
 */
router.delete(
  "/:id",
  canAccessResource({
    Model: Media,
    ownerField: "uploadedBy",
    allowedRoles: ["admin"],
  }),
  deleteMedia,
);

export default router;
