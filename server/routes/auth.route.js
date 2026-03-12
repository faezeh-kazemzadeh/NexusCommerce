import express from "express";
import { User } from "../models/user.model.js";
import {
  signup,
  signin,
  signout,
  refreshToken,
  forgotPassword,
  validateToken,
  resetPassword,
  updateUserProfile,
  getUserProfile,
} from "../controllers/auth.controller.js";
import {
  verifyRefreshToken,
  verifyToken,
} from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();
// ---------------------------------------------------------
// Public Routes
// ---------------------------------------------------------

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", validate(User.validateUser), signup);

/**
 * @route   POST /api/auth/signin
 * @desc    Authenticate user & get tokens
 * @access  Public
 */
router.post("/signin", signin);

/**
 * @route   POST /api/auth/signout
 * @desc    Logout user & clear cookies
 * @access  Public
 */
router.post("/signout", signout);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Get new access token using refresh token
 * @access  Public (Protected by Refresh Token)
 */
router.post("/refresh-token", verifyRefreshToken, refreshToken);

// ---------------------------------------------------------
// Password Recovery & Profile Routes
// ---------------------------------------------------------

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   PUT /api/auth/reset-password/:resettoken
 * @desc    Reset password using token
 * @access  Public
 */
router.put("/reset-password/:resettoken", resetPassword);

/**
 * @route   GET /api/auth/validate-token/:token
 * @desc    Check if password reset token is valid/expired
 * @access  Public
 */
router.get("/validate-token/:token", validateToken);

/**
 * @route   GET /api/auth/profile || PUT /api/auth/profile
 * @desc    Get or Update current logged-in user profile
 * @access  Private
 */
router
  .route("/profile")
  .get(verifyToken, getUserProfile)
  .put(verifyToken, validate(User.validateUserProfile), updateUserProfile);

export default router;
