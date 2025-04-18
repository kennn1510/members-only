const db = require("../db/db");
const bcrypt = require("bcryptjs");

function getSignUpForm(req, res) {
  res.render("signup");
}

async function createUser(req, res) {
  try {
    if (req.body.password !== req.body.confirm_password)
      res.status(404).send("Password does not match confirmation password");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser(
      req.body.first_name,
      req.body.last_name,
      req.body.username,
      hashedPassword
    );
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

module.exports = { getSignUpForm, createUser };
