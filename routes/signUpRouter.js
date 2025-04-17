const { Router } = require("express");
const signUpRouter = Router();
const signUpController = require("../controllers/signUpController");

signUpRouter.get("/", signUpController.getSignUpForm);
signUpRouter.post("/", async (req, res, next) => {
  try {
    if (req.body.password !== req.body.confirm_password)
      res.status(404).send("Password does not match confirm password");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)",
      [
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        hashedPassword,
      ]
    );
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = signUpRouter;
