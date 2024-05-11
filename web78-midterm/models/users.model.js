import mongoose from "mongoose";
import Collections from "../constants/collection.js";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collections.PROFILE,
    }
  },
  { versionKey: false }
);

const UserModel = mongoose.model(Collections.USERS, userSchema);
export default UserModel;
