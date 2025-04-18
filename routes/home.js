const { Router } = require("express");
const router = Router();
const homeController = require("../controllers/homeController");

router.get("/", (req, res) => res.render("home", { user: req.user }));

module.exports = router;
