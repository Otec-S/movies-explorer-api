const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  // getUsers,
  // findUserById,
  findCurrentUser,
  updateUserProfile,
  // updateUserAvatar,
} = require("../controllers/user");

// router.get("/users", getUsers);

router.get("/users/me", findCurrentUser);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUserProfile
);

// router.patch(
//   "/users/me/avatar",
//   celebrate({
//     body: Joi.object().keys({
//       avatar: Joi.string().pattern(
//         /^((https?):\/\/(www.)?([A-Z0-9]-)*)([A-Z0-9]+)(\w\.)*/i
//       ),
//     }),
//   }),
//   updateUserAvatar
// );

// router.get(
//   "/users/:id",
//   celebrate({
//     //   валидируем параметры
//     params: Joi.object().keys({
//       id: Joi.string().hex().length(24),
//     }),
//   }),
//   findUserById
// );

module.exports = router;
