const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  findCurrentUser,
  updateUserProfile,
  signOut,
} = require("../controllers/user");

router.get("/users/me", findCurrentUser);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  updateUserProfile
);

// разлогинивание
router.post("/signout", signOut);

module.exports = router;
