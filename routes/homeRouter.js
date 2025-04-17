const { Router } = require("express");
const homeRouter = Router();
const usersController = require("../controllers/usersController");

homeRouter.get("/", usersController.getHomePage);

module.exports = homeRouter;
