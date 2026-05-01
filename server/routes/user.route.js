import express from "express";

import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import {
  getUsersList,
  updateUserStatusController,
  updateUser,
} from "../controllers/user.controller.js";
import { User } from "../models/user.model.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// ---------------------------------------------------------
// All routes in this file require authentication and admin role
// ---------------------------------------------------------

router.use(verifyToken, authorize(["admin"]));

/**
 * @route   GET /api/users
 * @desc    Get list of all users with pagination and filters
 * @access  Private (Admin)
 */
router.get("/", getUsersList);

/**
 * @route   PATCH /api/users/:id
 * @desc    Update user details (Role, Email, Name) by Admin
 * @access  Private (Admin)
 */
router.patch("/:id", validate(User.validateUserUpdate), updateUser);

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Change user status (Activate, Deactivate, Delete, Restore)
 * @access  Private (Admin)
 */
router.patch(
  "/:id/status",
  validate(User.validateStatusAction),
  updateUserStatusController,
);

export default router;
