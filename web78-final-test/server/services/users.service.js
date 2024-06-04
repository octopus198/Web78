import UserModel from "../models/users.model.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";

class UserService {
    async register(email, password) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt);
        await UserModel.create({email, password: hashPassword})
    }

    async login(userId) {
        const access_token = await signToken({
            payload: {
                id: userId,
            }, 
            privateKey: process.env.JWT_PRIVATE_KEY
        })   
        return access_token;
    }
}

const userService = new UserService();

export default userService;