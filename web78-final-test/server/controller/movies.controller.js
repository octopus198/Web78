import { uploadImagesToCloudinary } from "../middleware/uploadImages.js";
import MovieModel from "../models/movies.model.js";
import movieService from "../services/movies.service.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getMovieController = async (req, res, next) => {
  try {
    const movies = await movieService.getMovies();
    return res.json({
      message: "Get movies successfully",
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get movies",
      error: error.message,
    });
  }
};

// use _id of MongoDB to delete and update movies
export const updateMovieController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedMovie = await MovieModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    upload.array('files', 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (req.files && req.files.length > 0) {
        const imageUrls = await uploadImagesToCloudinary(req);
        updatedMovie.image = imageUrls;
        await updatedMovie.save();
      }

      return res.json({
        message: "Movie updated successfully",
        data: updatedMovie,
      });
    });

  
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update movie",
      error: error.message,
    });
  }
};

export const deleteMovieController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMovie = await MovieModel.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json({
      message: "Movie deleted successfully",
      data: deletedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete movie",
      error: error.message,
    });
  }
};

export const createMovieController = async (req, res, next) => {
  try {
    const { name, time, year, image, introduce } = req.body;

    const newMovie = new MovieModel({
      name: name || "",
      time: time || 0,
      year: year || 0,
      image: image || "",
      introduce: introduce || "",
    });

    await newMovie.save();

    return res.status(201).json({
      message: "Movie created successfully",
      data: newMovie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create movie",
      error: error.message,
    });
  }
};


export const searchMoviesController = async (req, res, next) => {
  try {
    const { searchTerm } = req.query;
    const movies = await MovieModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { introduce: { $regex: searchTerm, $options: 'i' } },
      ],
    });

    return res.status(200).json({
      message: 'Movies found',
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to search movies',
      error: error.message,
    });
  }
};

export const sortMoviesAscendingController = async (req, res, next) => {
  try {
    const movies = await MovieModel.find().sort({ year: 1 });

    return res.status(200).json({
      message: 'Movies sorted in ascending order',
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to sort movies',
      error: error.message,
    });
  }
};

export const sortMoviesDescendingController = async (req, res, next) => {
  try {
    const movies = await MovieModel.find().sort({ year: -1 });

    return res.status(200).json({
      message: 'Movies sorted in descending order',
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to sort movies',
      error: error.message,
    });
  }
};
