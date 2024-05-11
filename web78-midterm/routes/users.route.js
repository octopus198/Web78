import { Router } from "express";
import {
  createValidator,
  loginValidator,
} from "../middleware/users.middleware.js";
import {
  createController,
  createNewProfileController,
  deleteProfileController,
  getMeController,
  loginController,
  logoutController,
  updateProfileController,
} from "../controller/user.controller.js";
import { authenticationValidator } from "../middleware/authenticationValidator.js";

const userRoute = Router();

// register api
userRoute.post("/register", createValidator, createController);

// log in api
userRoute.post("/login", loginValidator, loginController);

// log out api
userRoute.post("/logout", logoutController);

// create profile (profile is automatically created when user register. 
// but this method allows user to create another profile in case the user already deleted profile
userRoute.post(
  "/:id/profile",
  authenticationValidator,
  createNewProfileController
);

// get user profile
userRoute.get("/:id/profile", authenticationValidator, getMeController);

// update profile
userRoute.put("/:id/profile", authenticationValidator, updateProfileController);

// delete profile (soft delete)
userRoute.delete(
  "/:id/profile",
  authenticationValidator,
  deleteProfileController
);

export default userRoute;
