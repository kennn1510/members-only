const { Router } = require("express");
const router = Router();
const usersController = require("../controllers/homeController");

router.get("/", usersController.getHomePage);

module.exports = router;
