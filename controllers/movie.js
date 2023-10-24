const mongoose = require("mongoose");

const BadRequest400Error = require("../errors/bad-request-400-error");
const Forbidden403Error = require("../errors/forbidden-403-error");
const NotFound404Error = require("../errors/not-found-404-error");

// запрашиваем модель movie и присваеваем её константе Movie
const Movie = require("../models/movie");

/*
getMovies,
  createMovie,
  deleteMovieById,
*/

// получаем перечень всех фильмов
const getMovies = (req, res, next) => {
  Movie.find({})
    // вернём все фильмы, сохраненные пользователем
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

// создание новой карточки
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id; // ??? тут так?
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    // вернём записанные в базу данные
    .then((movie) => res.status(201).send(movie))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequest400Error(
            "Переданы некорректные данные при выборе фильма"
          )
        );
        return;
      }
      next(err);
    });
};

// удаление карточки
const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFound404Error("Фильм с указанным _id не найден."))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        return movie.deleteOne().then(() => res.send(movie));
      }

      throw new Forbidden403Error("У вас нет прав на удаление этого фильма");
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(
          new BadRequest400Error(
            "Переданы невалидные данные для удаления фильма"
          )
        );
        return;
      }
      next(err);
    });
};

// поставить лайк карточке
// const likemovie = (req, res, next) => {
//   movie.findByIdAndUpdate(
//     req.params.movieId,
//     { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//     { new: true }
//   )
//     .orFail(new NotFound404Error("Карточка с указанным _id не найдена."))
//     .then((movie) => res.status(200).send(movie))
//     .catch((err) => {
//       if (err instanceof mongoose.Error.CastError) {
//         next(new BadRequest400Error("Передан невалидный _id карточки"));
//         return;
//       }
//       next(err);
//     });
// };

// убрать лайк с карточки
// const dislikemovie = (req, res, next) => {
//   movie.findByIdAndUpdate(
//     req.params.movieId,
//     { $pull: { likes: req.user._id } }, // убрать _id из массива
//     { new: true }
//   )
//     .orFail(new NotFound404Error("Карточка с указанным _id не найдена."))
//     .then((movie) => res.status(200).send(movie))
//     .catch((err) => {
//       if (err instanceof mongoose.Error.CastError) {
//         next(new BadRequest400Error("Передан невалидный _id карточки"));
//         return;
//       }
//       next(err);
//     });
// };

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
  // likemovie,
  // dislikemovie,
};
