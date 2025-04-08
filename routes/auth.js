const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");

router.get("/sign-up", (req, res) => {
  res.render("sign-up", { errors: [] });
});

router.post(
  "/sign-up",
  [
    body("full_name").trim().notEmpty().withMessage("Full name is required."),
    body("username")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password.");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("sign-up", { errors: errors.array() });
    }

    const { full_name, username, password } = req.body;

    try {
      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.render("sign-up", {
          errors: [{ msg: "Username already exists." }],
        });
      }

      const newUser = await userModel.createUser(full_name, username, password);
      // Optionally log the user in automatically after signup
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/join-club");
      });
    } catch (error) {
      console.error("Error during sign up:", error);
      res.redirect("/sign-up"); // Or handle error appropriately
    }
  }
);

module.exports = router;
