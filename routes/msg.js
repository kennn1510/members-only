const { Router } = require("express");
const router = Router();
const db = require("../db/db");

router.get("/", (req, res) => {
  res.render("msgform");
});
router.post("/", async (req, res) => {
  await db.createNewMessage(req.body.newMessage, req.session.passport.user);
  res.redirect("/");
});

module.exports = router;
