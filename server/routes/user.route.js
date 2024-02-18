const express = require("express");
const router = express.Router();
const passport = require("passport");

// Import middleware and controller functions specifically used in the signup route
const { addUser } = require("../controllers/user.controller");

const {
  addUserValidator,
  addUserValidatorHandler,
} = require("../middlewares/users/usersValidator");

// const sendVerificationEmail = require("../middlewares/users/verifyEmail");

const avatarUpload = require("../middlewares/users/avatarUpload");
// const { signUpSignInLimiter } = require("../middlewares/limiter/limiter");

router.post(
  "/signup",
  // signUpSignInLimiter,
  avatarUpload,
  addUserValidator,
  addUserValidatorHandler,
  addUser,
  // sendVerificationEmail,
);

module.exports = router;
