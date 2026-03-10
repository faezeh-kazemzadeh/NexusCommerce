import express from "express";
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

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);
router.get("/validate-token/:token", validateToken);
router
  .route("/profile")
  .get(verifyToken, getUserProfile)
  .put(verifyToken, updateUserProfile);

export default router;
