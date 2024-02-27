const express = require("express");
const router = express.Router();

// Import middleware and controller functions specifically used in the signup route
const {
  addUser,
  signin,
  refreshToken,
} = require("../controllers/user.controller");

const {
  addUserValidator,
  addUserValidatorHandler,
} = require("../middlewares/users/usersValidator");

const avatarUpload = require("../middlewares/users/avatarUpload");
const requestIp = require("request-ip");
const useragent = require("express-useragent");

router.post(
  "/signup",
  // signUpSignInLimiter,
  avatarUpload,
  addUserValidator,
  addUserValidatorHandler,
  addUser,
  // sendVerificationEmail,
);

router.post("/refresh-token", refreshToken);

router.post(
  "/signin",
  // signUpSignInLimiter,
  requestIp.mw(),
  useragent.express(),
  signin,
  // sendLoginVerificationEmail,
);

module.exports = router;
