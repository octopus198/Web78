import UserModel from "../models/users.model.js";
import ProfileModel from "../models/profile.model.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";
import { config } from "dotenv";
config();

class UserService {
  async register(username, email, password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({
      username,
      email,
      password: hashPassword,
    });
    // create user document, profile document and have them referenced each other
    const profile = await ProfileModel.create({ ownerId: user._id });
    await UserModel.findByIdAndUpdate(user._id, { profileId: profile._id });
  }
  async login(userId) {
    const access_token = await signToken({
      payload: {
        id: userId,
      },
      privateKey: process.env.JWT_PRIVATE_KEY,
    });
    return access_token;
  }

  async getMe(id) {
    const profile = await ProfileModel.findOne({ ownerId: id, deletedAt: null });
    if (!profile) {
      return { message: "Profile not found or has been deleted" };
    }
    return profile;
  }
  async createNewProfile(userId, profileData) { 
    if (!profileData || Object.keys(profileData).length === 0) {
        throw new Error("Profile data is required");
      }
    const existingProfiles = await ProfileModel.find({ ownerId: userId });
    const allProfilesDeleted = existingProfiles.every(profile => profile.deletedAt !== null);
    if (allProfilesDeleted) {
        const newProfile = await ProfileModel.create({ ownerId: userId, ...profileData });
        await UserModel.findOneAndUpdate({ _id: userId }, { profileId: newProfile._id });
        return { message: "Profile created successfully!", profile: newProfile };
    } else {
        return { message: "Cannot create a new profile. One or more existing profiles still active." };
    }
  }
}

const userService = new UserService();

export default userService;

