const router = require("express").Router();

const { userValidation } = require("../middlewares/validations");

const {
  findCurrentUser,
  updateUserProfile,
  signOut,
} = require("../controllers/user");

router.get("/users/me", findCurrentUser);

router.patch("/users/me", userValidation, updateUserProfile);

// разлогинивание
router.post("/signout", signOut);

module.exports = router;
