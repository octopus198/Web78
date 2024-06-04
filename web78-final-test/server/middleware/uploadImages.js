import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Router } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImagesToCloudinary = async (req, res) => {
    const listFile = req.files;
  
    if (!listFile || listFile.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    try {
      const uploadPromises = listFile.map((file) => {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const fileName = file.originalname.split(".")[0];
  
        return cloudinary.uploader.upload(dataUrl, {
          public_id: fileName,
          resource_type: "auto",
        });
      });
  
      const results = await Promise.all(uploadPromises);
      return results.map((result) => result.secure_url);
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      throw new Error("Error uploading file(s)");
    }
  };