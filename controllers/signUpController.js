const db = require("../db/db");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", { errors: errors.array() });
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

module.exports = { getSignUpForm, createUser };
