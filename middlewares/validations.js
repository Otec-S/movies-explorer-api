const { celebrate, Joi } = require("celebrate");

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const paramsValidation = celebrate({
  //   валидируем параметры
  params: Joi.object().keys({
    _id: Joi.string()
    // .hex()
    // .length(24)
    ,
  }),
});

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

const movieValidation = celebrate({
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
      // .required()
      .pattern(/^((https?):\/\/(www.)?([A-Z0-9]-)*)([A-Z0-9]+)(\w\.)*/i),
    movieId: Joi.number()
    .required()
    ,
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  paramsValidation,
  userValidation,
  movieValidation,
};
