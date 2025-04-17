const db = require("../db/db");

function getSignUpForm(req, res) {
  res.render("sign-up");
}

async function createUser(req, res) {}

module.exports = { getSignUpForm, createUser };
