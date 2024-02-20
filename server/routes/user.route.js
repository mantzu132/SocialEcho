const express = require("express");
const router = express.Router();

// Import middleware and controller functions specifically used in the signup route
const { addUser, signin } = require("../controllers/user.controller");

const {
  addUserValidator,
  addUserValidatorHandler,
} = require("../middlewares/users/usersValidator");

// const sendVerificationEmail = require("../middlewares/users/verifyEmail");

const avatarUpload = require("../middlewares/users/avatarUpload");
const requestIp = require("request-ip");
const useragent = require("express-useragent");
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

router.post(
  "/signin",
  // signUpSignInLimiter,
  requestIp.mw(),
  useragent.express(),
  signin,
  // sendLoginVerificationEmail,
);

router.post("/signin", (req, res) => {
  res.json("HELLO WORLD!");
});

module.exports = router;
