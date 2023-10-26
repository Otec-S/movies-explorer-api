const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require("../controllers/movie");

router.get("/movies", getMovies);

router.post(
  "/movies",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .pattern(/^((https?):\/\/(www.)?([A-Z0-9]-)*)([A-Z0-9]+)(\w\.)*/i),
      trailerLink: Joi.string()
        .required()
        .pattern(/^((https?):\/\/(www.)?([A-Z0-9]-)*)([A-Z0-9]+)(\w\.)*/i),
      thumbnail: Joi.string()
        .required()
        .pattern(/^((https?):\/\/(www.)?([A-Z0-9]-)*)([A-Z0-9]+)(\w\.)*/i),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie
);

router.delete(
  "/movies/:_id",
  celebrate({
    //   валидируем параметры
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  deleteMovieById
);

module.exports = router;
