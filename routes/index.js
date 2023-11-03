const router = require("express").Router();
const usersRouter = require("./user");
const moviesRouter = require("./movie");


// применяем импортированный для юзеров route
router.use(usersRouter);

// применяем импортированный для фильмов route
router.use(moviesRouter);

module.exports = router;
