const User = require("../models/user.model");
const bcrypt = require("bcrypt");
/**
 * Adds a new user to the database with the given name, email, password, and avatar.
 *
 * @description If the email domain of the user's email is "mod.socialecho.com", the user will be
 * assigned the role of "moderator" by default, but not necessarily as a moderator of any community.
 * Otherwise, the user will be assigned the role of "general" user.
 *
 * @param {Object} req.files - The files attached to the request object (for avatar).
 * @param {Function} next - The next middleware function to call if consent is given by the user to enable context based auth.
 */
const addUser = async (req, res, next) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  /**
   * @type {boolean} isConsentGiven
   */
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

module.exports = { addUser };
