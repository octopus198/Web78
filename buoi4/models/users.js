import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: Number
})

const UserModel = mongoose.model('users', userSchema)

export default UserModel