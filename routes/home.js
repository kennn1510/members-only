const { Router } = require("express");
const router = Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getHomePage);

module.exports = router;
