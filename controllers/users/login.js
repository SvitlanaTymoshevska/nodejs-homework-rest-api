const { User } = require("../../models");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.verify || !user.comparePassword(password)) {
    throw new Unauthorized("Email or password is wrong or email is not verify");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

module.exports = login;
