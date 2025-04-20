const {Router} = require("express");
const router = Router();
const signUpController = require("../controllers/signUpController");

router.get("/", signUpController.getSignUpForm);
router.post("/", signUpController.createUser);

module.exports = router;
