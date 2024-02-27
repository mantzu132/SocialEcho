const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const { saveLogInfo } = require("../middlewares/logger/logInfo");

const LOG_TYPE = {
  SIGN_IN: "sign in",
  LOGOUT: "logout",
};

const LEVEL = {
  INFO: "info",
  ERROR: "error",
  WARN: "warn",
};

const MESSAGE = {
  SIGN_IN_ATTEMPT: "User attempting to sign in",
  SIGN_IN_ERROR: "Error occurred while signing in user: ",
  INCORRECT_EMAIL: "Incorrect email",
  INCORRECT_PASSWORD: "Incorrect password",
  DEVICE_BLOCKED: "Sign in attempt from blocked device",
  CONTEXT_DATA_VERIFY_ERROR: "Context data verification failed",
  MULTIPLE_ATTEMPT_WITHOUT_VERIFY:
    "Multiple sign in attempts detected without verifying identity.",
  LOGOUT_SUCCESS: "User has logged out successfully",
};

const addUser = async (req, res, next) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // const isConsentGiven = JSON.parse(req.body.isConsentGiven);

  const defaultAvatar =
    "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg";
  const fileUrl = req.files?.[0]?.filename
    ? `${req.protocol}://${req.get("host")}/assets/userAvatars/${
        req.files[0].filename
      }`
    : defaultAvatar;

  const emailDomain = req.body.email.split("@")[1];
  const role = emailDomain === "mod.socialecho.com" ? "moderator" : "general";
  newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: role,
    avatar: fileUrl,
  });

  try {
    await newUser.save();
    if (newUser.isNew) {
      throw new Error("Failed to add users");
    }

    res.status(201).json({
      message: "User added successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const signin = async (req, res, next) => {
  await saveLogInfo(req, MESSAGE.SIGN_IN_ATTEMPT, LOG_TYPE.SIGN_IN, LEVEL.INFO);

  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({
      email: email,
    });
    if (!existingUser) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_EMAIL,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR,
      );
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_PASSWORD,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR,
      );

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const newRefreshToken = new Token({
      user: existingUser._id,
      refreshToken,
      accessToken,
    });
    await newRefreshToken.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar,
      },
    });
  } catch (err) {
    await saveLogInfo(
      req,
      MESSAGE.SIGN_IN_ERROR + err.message,
      LOG_TYPE.SIGN_IN,
      LEVEL.ERROR,
    );

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const existingToken = await Token.findOne({
      refreshToken: { $eq: refreshToken },
    });
    if (!existingToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    const existingUser = await User.findById(existingToken.user);
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const refreshTokenExpiresAt =
      jwt.decode(existingToken.refreshToken).exp * 1000;
    if (Date.now() >= refreshTokenExpiresAt) {
      await existingToken.deleteOne();
      return res.status(401).json({
        message: "Expired refresh token",
      });
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });

    res.status(200).json({
      accessToken,
      refreshToken: existingToken.refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { addUser, signin, refreshToken };
