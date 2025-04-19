const passport = require("passport");

function login(req, res, next) {
  return passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  })(req, res);
}

module.exports = { 
  login,
  logout,
};
