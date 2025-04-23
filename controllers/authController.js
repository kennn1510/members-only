const passport = require("passport");
const db = require("../db/db");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

function login(req, res, next) {
  return passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureMessage: "Login failed!",
  })(req, res, next);
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

function getSignUpForm(req, res) {
  res.render("signup");
}

const validateSignUp = [
  body("first_name")
    .trim()
    .isAlpha()
    .withMessage("First name must only have letters.")
    .notEmpty()
    .withMessage("First name cannot be empty"),
  body("last_name")
    .trim()
    .isAlpha()
    .withMessage("Last name must only have letters.")
    .notEmpty()
    .withMessage("Last name cannot be empty"),
  body("username")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be a minimum of 6 characters"),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirmation password does not match password.");
    }
    return true;
  }),
];

const createUser = [
  validateSignUp,
  async (req, res) => {
    const { first_name, last_name, username } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        errors: errors.array(),
        formData: {
          firstName: first_name,
          lastName: last_name,
          username: username,
        },
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await db.createUser(
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        hashedPassword,
      );
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
];

function getMembershipForm(req, res) {
  res.render("passcode", { user: req.user });
}

async function updateUserMembership(req, res) {
  // I should validate and sanitize
  await db.updateMembership(req.user.id);
  res.redirect("/");
}

module.exports = {
  login,
  logout,
  getSignUpForm,
  createUser,
  updateUserMembership,
  getMembershipForm,
};
