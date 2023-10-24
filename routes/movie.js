const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getMovies,
  createMovie,
  deleteMovieById,
  // likeCard,
  // dislikeCard,
} = require("../controllers/movie");

/*
# возвращает все сохранённые текущим пользователем фильмы
GET /movies

# создаёт фильм с переданными в теле
# country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
POST /movies

# удаляет сохранённый фильм по id
DELETE /movies/_id

*/

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
  "/movies/:movieId",
  celebrate({
    //   валидируем параметры
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovieById
);

// router.put(
//   "/cards/:cardId/likes",
//   celebrate({
//     //   валидируем параметры
//     params: Joi.object().keys({
//       cardId: Joi.string().hex().length(24),
//     }),
//   }),
//   likeCard
// );

// router.delete(
//   "/cards/:cardId/likes",
//   celebrate({
//     //   валидируем параметры
//     params: Joi.object().keys({
//       cardId: Joi.string().hex().length(24),
//     }),
//   }),
//   dislikeCard
// );

module.exports = router;
