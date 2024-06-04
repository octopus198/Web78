import MovieModel from "../models/movies.model.js";

class MovieService {
  async getMovies() {
    try {
      const movies = await MovieModel.find();
      return movies;
    } catch (error) {
      throw new Error("Error fetching movies: " + error.message);
    }
  }
}

const movieService = new MovieService();

export default movieService;
