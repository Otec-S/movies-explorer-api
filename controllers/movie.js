const mongoose = require("mongoose");

const BadRequest400Error = require("../errors/bad-request-400-error");
const Forbidden403Error = require("../errors/forbidden-403-error");
const NotFound404Error = require("../errors/not-found-404-error");

// запрашиваем модель movie и присваеваем её константе Movie
const Movie = require("../models/movie");

/*
// получаем перечень всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    // вернём все карточки
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
*/

// получаем перечень всех фильмов этого пользователя
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

// создание/добавление новой карточки
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
  const owner = req.user._id; // в owner только id пользователя
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

// удаление фильма
const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
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

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
