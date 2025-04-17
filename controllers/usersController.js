const db = require("../db/db");
// const { body, validationResult } = require("express-validator");

function getHomePage(req, res) {
  res.render("index", { user: req.user });
}

async function getUserById(req, res) {
  res.render("index", { user: db.getUser(req.id) });
}

module.exports = { getHomePage, getUserById };
