import mongoose from "mongoose";
import Collections from "../constants/collection.js";

const profileSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collections.USERS,
    },
    personalInfo: {
      type: {
        fullName: { type: String, default: "" },
        dateOfBirth: { type: Date, default: null },
        placeOfBirth: { type: String, default: "" },
        nationality: { type: String, default: "" },
        education: {
          school: { type: String, default: "" },
          degree: { type: String, default: "" },
          startDate: { type: Date, default: null },
          endDate: { type: Date, default: null },
        },
      },
      default: {},
    },
    workInfo: {
      skills: [String],
      personalProjects: [
        {
          projectName: String,
          projectDescription: String,
          role: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      workHistory: [
        {
          companyName: String,
          title: String,
          startDate: Date,
          endDate: Date,
          stillWorking: Boolean,
        },
      ],
    },
    additionalInfo: {
      hobbies: [String],
      personalGoals: [String],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { versionKey: false }
);

const ProfileModel = mongoose.model(Collections.PROFILE, profileSchema);
export default ProfileModel;
