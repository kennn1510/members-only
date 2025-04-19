const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.get("/", (req, res) => res.render("login")); 
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
