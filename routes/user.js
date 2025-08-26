const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const wrapAsync = require("../utills/wrapAsync");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const { isLoggedIn, saveRedirectUrl } = require("../utills/addMidwares");
const { flushCompileCache } = require("module");
const UserController = require("../controllers/user");

router
  .route("/signup")
  .get(UserController.signupForm)
  .post(upload.single("profileImage"), wrapAsync(UserController.signup));

router
  .route("/login")
  .get(UserController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(UserController.login)
  );

router.get("/logout", UserController.logout);

// render profile
router.get("/profile", isLoggedIn, wrapAsync(UserController.randerProfile));

router
  .route("/change-password")
  .get(UserController.passwordChangeForm)
  .post(wrapAsync(UserController.passwordChange));

router.delete("/profile/:id", wrapAsync(UserController.destroyProfile));

module.exports = router;
