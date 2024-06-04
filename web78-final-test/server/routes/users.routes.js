import { Router } from "express";
import { loginValidator, registerValidator } from "../middleware/users.middleware.js";
import { loginController, logoutController, registerController } from "../controller/users.controller.js";

const userRoute = Router();

userRoute.post("/register", registerValidator, registerController);
userRoute.post("/login", loginValidator, loginController);
userRoute.post('/logout/', logoutController);

export default userRoute;