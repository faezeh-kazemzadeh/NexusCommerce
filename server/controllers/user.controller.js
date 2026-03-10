import _ from "lodash";
import asyncHandler from "express-async-handler";
import {
  getUsersService,
  updateUserStatusService,
  updateUserService,
} from "../services/user.service.js";

//  @Destination    Get Users List
//  @Route          GET /api/users
//  @Access         requiredRoles: ["Admin"]
export const getUsersList = asyncHandler(async (req, res) => {
  const {
    status = "active",
    search = "",
    page = 1,
    limit = 10,
    sort = "createdAt",
  } = req.query;

  const result = await getUsersService({
    status,
    search,
    page,
    limit,
    sort,
  });

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    ...result,
  });
});

// @Destination    Update User Status (Delete, Restore, Activate, Deactivate)
// @Route         PATCH /api/users/:id/status
// @Access         requiredRoles: ["Admin"]
export const updateUserStatusController = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { action } = req.body;

    const updatedUser = await updateUserStatusService(id, action);

    const actionMessages = {
      delete: "User deleted successfully",
      restore: "User restored successfully",
      activate: "User activated successfully",
      deactivate: "User deactivated successfully",
    };

    res.status(200).json({
      success: true,
      message: actionMessages[action] || "User status updated successfully",
      user: updatedUser,
    });
  },
);

// @Destination    Update User (Name, Email, Role, Active Status)
// @Route         [PATCH] /api/users/:id
// @Access         requiredRoles: ["Admin"]
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedUser = await updateUserService(id, req.body);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});
