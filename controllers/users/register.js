const { User } = require("../../models");
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

const { sendEmail } = require("../../helpers");
const { BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password, subscription = "starter" } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict("Email in use");
  }

  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  const newUser = new User({
    email,
    subscription,
    avatarURL,
    verificationToken,
  });

  newUser.setPassword(password);

  await newUser.save();
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/:${verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email,
      subscription,
      avatarURL,
      verificationToken,
    },
  });
};

module.exports = register;
