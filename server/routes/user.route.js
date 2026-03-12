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
router.use(verifyToken, authorize(["admin"]));

router.get("/", getUsersList);
router.patch("/:id", validate(User.validateUserUpdate), updateUser);
router.patch(
  "/:id/status",
  validate(User.validateStatusAction),
  updateUserStatusController,
);

export default router;
