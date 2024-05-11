import { validationResult } from "express-validator";

export const validator = (validation) => {
  return async (req, res, next) => {
    await validation.run(req);
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length > 0) {
      next(errors);
    }
    next();
  };
};
