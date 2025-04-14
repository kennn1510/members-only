const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const homeRouter = require("./routes/home");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", homeRouter);
app.get("/sign-up", (req, res) => res.render("sign-up"));
app.post("/sign-up", async (req, res, next) => {
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
app.post(
  "/log-in",
  passport.authenticate("local", { successRedirect: "/", failureRedirect: "/" })
);
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Incorrect password" });
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.listen(3000, () => console.log("App server listening on port 3000"));
