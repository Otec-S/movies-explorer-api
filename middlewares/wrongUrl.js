const NotFound404Error = require("../errors/not-found-404-error");

// общая ошибка в url
module.exports = (req, res, next) => {
  const err = new NotFound404Error("Неверный адрес страницы");
  return next(err);
};
