require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");

const { createUser } = require("./controllers/user");
const { login } = require("./controllers/user");
const auth = require("./middlewares/auth");
const routes = require("./routes/index");

const wrongUrl = require("./middlewares/wrongUrl");
const centralErrorHandler = require("./middlewares/centralErrorHandler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const limiter = require("./middlewares/limiter");

const {
  signInValidation,
  signUpValidation,
} = require("./middlewares/validations");

const { PORT, MONGO_URL } = process.env;

const app = express();

app.use(helmet());

app.use(cors());

app.use(limiter);

app.use(cookieParser());

// научили express работать с json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose
  .connect(MONGO_URL, {
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
app.post("/signin", signInValidation, login);

app.post("/signup", signUpValidation, createUser);

// модлвэр авторизации
app.use(auth);

// применяем все роуты из index.js
app.use(routes);

// обработка неправильного пути
app.use("/*", wrongUrl); // ?? ПЕРЕДЕЛАТЬ - тут будет перенаправление на отдельную страницу 404

// подключаем логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки
app.use(centralErrorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт слушает приложение
  console.log(`Приложение слушает порт ${PORT}`);
});
