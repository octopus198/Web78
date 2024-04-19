import express from "express";
import mongoose from "mongoose";
import UserModel from "./models/users.js";
import axios from "axios";

const app = express();
mongoose
  .connect(
    "mongodb+srv://linhtran190897:DuZ7Nfs6HZ80UFAB@web-78.7igvc5y.mongodb.net/"
  )
  .then(() => {
    console.log("Connect successfully");
  });

const PORT = 4000;
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({});
});

app.post("/api/v1/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      throw new Error("User is already exist");
    }
    const user = await UserModel.create({
      name,
      email,
    });

    res.status(201).send({
      data: user,
      message: "User registered successfully",
      success: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error ${err.message}`);
  } else {
    console.log(`Your server is listening on port ${PORT}`);
  }
});
