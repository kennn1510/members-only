const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
