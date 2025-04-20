const db = require("../db/db");
const bcrypt = require("bcryptjs");

function getSignUpForm(req, res) {
  res.render("signup");
}

async function createUser(req, res) {
  try {
    // Add express-validator later
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

module.exports = {getSignUpForm, createUser};
