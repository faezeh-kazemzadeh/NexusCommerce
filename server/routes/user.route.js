import express from "express";

import { verifyToken, authorize } from "../middleware/auth.middleware.js";
import {
  getUsersList,
  updateUserStatusController,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();
router.use(verifyToken, authorize(["admin"]));

router.get("/", getUsersList);
router.patch("/:id", updateUser);
router.patch("/:id/status", updateUserStatusController);

export default router;
