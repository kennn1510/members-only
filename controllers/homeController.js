function getHomePage(req, res) {
  res.render("home", { user: req.user });
}

module.exports = { getHomePage };
