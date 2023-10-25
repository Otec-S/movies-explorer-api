require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const cors = require("cors");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");

const { createUser } = require("./controllers/user");
const { login } = require("./controllers/user");
const auth = require("./middlewares/auth");
const usersRouter = require("./routes/user");
const moviesRouter = require("./routes/movie");

const wrongUrl = require("./middlewares/wrongUrl");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 4000 } = process.env;

const app = express();

app.use(helmet());

app.use(cors());

// научили express работать с json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose
  .connect("mongodb://127.0.0.1:27017/bitfilmsdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("База данных подключена");
  })
  .catch(new Error("Ошибка подключения базы данных"));

// подключаем логгер запросов
app.use(requestLogger);

// роуты, не требующие авторизации, например, регистрация и логин
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      // about: Joi.string().min(2).max(30),
      // avatar: Joi.string().pattern(
      //   /^((https?):\/\/(www.)?([A-Z0-9]-)*)([A-Z0-9]+)(\w\.)*/i
      // ),
    }),
  }),
  createUser
);

// модлвэр авторизации
app.use(auth);

// применяем импортированный для юзеров route
app.use(usersRouter);

// применяем импортированный для фильмов route
app.use(moviesRouter);

// обработка неправильного пути
app.use("/*", wrongUrl); // !!!! ПЕРЕДЕЛАТЬ - тут будет перенаправление на отдельную страницу 404

// подключаем логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт слушает приложение
  console.log(`Приложение слушает порт ${PORT}`);
});
