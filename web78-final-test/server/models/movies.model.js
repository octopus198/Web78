import mongoose from "mongoose";
import Collections from "../constants/collections.js";

const movieSchema = new mongoose.Schema(
    {
        name: String,
        time: Number,
        year: Number,
        image: [String],
        introduce: String
    },
    {versionKey: false}
)

const MovieModel = mongoose.model(Collections.MOVIES, movieSchema);

export default MovieModel;