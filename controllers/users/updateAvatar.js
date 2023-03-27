const { User } = require("../../models");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const createError = require("http-errors");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const avatarName = `${id}_${originalname}`;

  try {
    const resultUpload = path.join(avatarsDir, avatarName);
    const avatar = await Jimp.read(tempUpload);

    if (!avatar) {
      throw createError(400, "download error");
    }
    avatar.autocrop().resize(250, 250, Jimp.RESIZE_BEZIER).write(resultUpload);
    await fs.unlink(tempUpload);

    const avatarURL = path.join("public", "avatars", avatarName);
    await User.findByIdAndUpdate(id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    next(error);
  }
};

module.exports = updateAvatar;
