import _ from "lodash";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getUsersService = async ({
  status = "active",
  search = "",
  page = 1,
  limit = 10,
  sort = "createdAt",
}) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);

  let query = {};

  switch (status) {
    case "deleted":
      query.isDeleted = true;
      break;

    case "inactive":
      query.active = false;
      query.isDeleted = false;
      break;

    case "active":
    default:
      query.active = true;
      query.isDeleted = false;
  }

  if (search) {
    query.$or = [
      { firstname: { $regex: search, $options: "i" } },
      { lastname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { roles: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const skip = (pageNumber - 1) * limitNumber;

  const users = await User.find(query)
    .select("-password -__v")
    .sort({ [sort]: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  const total = await User.countDocuments(query);

  return {
    users,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      limit: limitNumber,
    },
  };
};

export const updateUserService = async (userId, updates) => {
  const allowedUpdates = ["firstname", "lastname", "email", "active", "roles"];
  const filteredUpdates = _.pick(updates, allowedUpdates);

  if (_.isEmpty(filteredUpdates)) {
    throw errorHandler(400, "No valid fields provided.");
  }

  if (filteredUpdates.email) {
    const existingUser = await User.findOne({
      email: filteredUpdates.email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw errorHandler(400, "Email is already in use.");
    }
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { $set: filteredUpdates },
    { new: true, runValidators: true },
  ).select("-password -__v");

  if (!user) {
    throw errorHandler(404, "User not found or deleted.");
  }

  return user;
};

export const updateUserStatusService = async (userId, action) => {
  let updateData = {};

  switch (action) {
    case "delete":
      updateData = { isDeleted: true, active: false };
      break;
    case "restore":
      updateData = { isDeleted: false, active: true };
      break;
    case "activate":
      updateData = { active: true };
      break;

    case "deactivate":
      updateData = { active: false };
      break;
    default:
      throw errorHandler(400, "Invalid status action.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true },
  ).select("-password -__v");

  if (!user) throw errorHandler(404, "User not found.");
  return user;
};
