const express = require("express");

const { auth, validation, ctrlWrapper, upload } = require("../../middelwares");
const { users: ctrl } = require("../../controllers");
const {
  RegisterJoiSchema,
  LoginJoiSchema,
  SubscriptionJoiSchema,
} = require("../../models/user");

const router = express.Router();

router.post(
  "/register",
  validation(RegisterJoiSchema),
  ctrlWrapper(ctrl.register)
);

router.post("/login", validation(LoginJoiSchema), ctrlWrapper(ctrl.login));

router.get("/current", auth, ctrlWrapper(ctrl.getCurrent));

router.patch(
  "/",
  auth,
  validation(SubscriptionJoiSchema),
  ctrlWrapper(ctrl.updateUser)
);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  ctrlWrapper(ctrl.updateAvatar)
);

router.post("/logout", auth, ctrlWrapper(ctrl.logout));

module.exports = router;
