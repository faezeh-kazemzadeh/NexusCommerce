import { errorHandler } from "../utils/error.js";

export const validate = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      return next(errorHandler(400, error.details[0].message));
    }
    next();
  };
};
