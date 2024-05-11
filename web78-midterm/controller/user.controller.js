import userService from "../services/user.service.js";
import { USER_MESSAGE } from "../constants/message.js";
import ProfileModel from "../models/profile.model.js";

export const createController = async (req, res, next) => {
  const { username, email, password } = req.body;
  await userService.register(username, email, password);
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

export const getMeController = async (req, res, next) => {
  const { id } = req.params;
  const result = await userService.getMe(id);
  return res.json({
    message: USER_MESSAGE.GET_ME_SUCCESSFULLY,
    result,
  });
};

export const createNewProfileController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const profileData = req.body;
    const result = await userService.createNewProfile(id, profileData);
    res.send(result);
  } catch (err) {
    next(err);
  }
};


export const updateProfileController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const profileUpdatedData = { ownerId: id, ...req.body };
    // const updatedProfile = await ProfileModel.findByIdAndUpdate(id, profileUpdatedData, {new: true})

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { ownerId: id, deletedAt: null },
      profileUpdatedData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

// soft delete profile (just update deleteAt field)
export const deleteProfileController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProfile = await ProfileModel.findOneAndUpdate(
      { ownerId: id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile soft deleted successfully" });
  } catch (err) {
    next(err);
  }
};


// logout controller
const blacklistedTokens = new Set();

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: "Unauthorized. Token is invalid." });
  }
  next();
};

export const logoutController = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    blacklistedTokens.add(token);
    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};


// export const createProfileController = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const {
//       fullName,
//       dateOfBirth,
//       placeOfBirth,
//       nationality,
//       education,
//       workInfo,
//       additionalInfo,
//     } = req.body;
//     const newProfile = await ProfileModel.create({
//       ownerId: id,
//       personalInfo: {
//         fullName,
//         dateOfBirth,
//         placeOfBirth,
//         nationality,
//         education,
//       },
//       workInfo,
//       additionalInfo,
//     });
//     res
//       .status(201)
//       .json({ message: "Profile created successfully", profile: newProfile });
//   } catch (err) {
//     next(err);
//   }
// };