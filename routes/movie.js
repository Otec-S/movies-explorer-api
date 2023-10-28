const router = require("express").Router();

const {movieValidation, paramsValidation} = require("../middlewares/validations");

const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require("../controllers/movie");

router.get("/movies", getMovies);

router.post("/movies", movieValidation, createMovie);

router.delete("/movies/:_id", paramsValidation, deleteMovieById);

module.exports = router;
