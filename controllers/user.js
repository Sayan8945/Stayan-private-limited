const User = require("../Models/user");

module.exports.signupForm = (req, res) => {
  res.render("users/signup");
}
module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      // console.log(req.body);
      // console.log(req.file);
      let profileImage = req.file.path;
      const newUser = new User({ username, email, profileImage });
      const registerUser = await User.register(newUser, password);
      // console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Successfully signed up! Welcome to wonderlust!");
        res.redirect("/listings");
      });
    } catch (err) {
      if (err.name === "UserExistsError") {
        req.flash("error", "That username is already taken!");
        res.redirect("/signup");
      } else {
        console.error(err);
        req.flash("error", err.message || "Signup failed");
        res.redirect("/signup");
      }
    }
  }

module.exports.loginForm = (req, res) => {
  res.render("users/login");
}

module.exports.login = async (req, res) => {
    req.flash("success", "You are successfully logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
  }

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("error", "You are logged out!");
      res.redirect("/listings");
    }
  });
}

module.exports.randerProfile = async (req, res) => {
    let user = await User.findById(req.user._id);
    // let user = await User.findById(req.user);
    res.render("users/profile.ejs", { user });
  }

module.exports.passwordChangeForm = (req, res) => {
  res.render("users/changePass.ejs");
}
module.exports.passwordChange = async (req, res) => {
    console.log(req.body);
    const { oldPassword, newPassword } = req.body;
    try {
      await req.user.changePassword(oldPassword, newPassword);
      req.flash("success", "Password changed successfully!");
      res.redirect("/profile");
    } catch (err) {
      console.error(err);
      req.flash(
        "error",
        "Failed to change password. Make sure your old password is correct."
      );
      res.redirect("/change-password");
    }
  }

module.exports.destroyProfile = async (req, res) => {
    let { id } = req.params;
    let deletedUser = await User.findByIdAndDelete(id);
    // console.log(deletedUser);
    req.flash(
      "success",
      `User:'${deletedUser.username}' successfully deleted!`
    );
    res.redirect("/signup");
  }