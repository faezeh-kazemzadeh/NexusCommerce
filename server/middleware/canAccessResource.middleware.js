import { errorHandler } from "../utils/error.js";

export const canAccessResource = ({
  Model,
  ownerField = "author",
  allowedRoles = [],
}) => {
  return async (req, res, next) => {
    try {
      if (!req.user)
        return next(errorHandler(401, "Unauthorized: User not authenticated"));

      const resource = await Model.findById(req.params.id).select(ownerField);
      if (!resource) {
        return next(errorHandler(404, "Resource not found"));
      }

      const userId = req.user.id;
      const userRoles = req.user.roles;

      if (userRoles.some((r) => allowedRoles.includes(r))) {
        return next();
      }

      if (
        userRoles.includes("author") &&
        resource[ownerField]?.equals(userId)
      ) {
        return next();
      }

      return next(errorHandler(403, "Forbidden"));
    } catch (error) {
      console.error(error);
      return next(errorHandler(500, "Server error"));
    }
  };
};
