import verify  from "jsonwebtoken";
import { USER_MESSAGE } from "../constants/message.js";
import userService from "../services/users.service.js";

export const registerController = async (req, res, next) => {
  const { email, password } = req.body;
  await userService.register(email, password);
  return res.json({
    message: "Register Successfully",
  });
};

export const loginController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const access_token = await userService.login(userId);
    return res.json({
      message: "Login Successfully",
      access_token,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  // set the access token to expire in 30s
  try {
    res.clearCookie("accessToken");

    return res.json({
      message: USER_MESSAGE.LOGOUT_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
};

