const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.get("/login", (req, res) => res.render("login"));
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignUpForm);
router.post("/signup", authController.createUser);
router.get("/update", authController.getMembershipForm);
router.post("/update", authController.updateUserMembership);

module.exports = router;
