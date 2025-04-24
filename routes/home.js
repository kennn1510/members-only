const { Router } = require("express");
const router = Router();
const db = require("../db/db");

router.get("/", async (req, res) =>
  res.render("home", { user: req.user, messages: await db.getAllMessages() }),
);
router.post("/", async (req, res) => {
  await db.deleteMessageById(req.body.messageToBeDeleted);
  res.redirect("/");
});

module.exports = router;