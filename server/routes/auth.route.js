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

router.post("/signup", validate(User.validateUser), signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);
router.get("/validate-token/:token", validateToken);
router
  .route("/profile")
  .get(verifyToken, getUserProfile)
  .put(verifyToken, validate(User.validateUserProfile), updateUserProfile);

export default router;
