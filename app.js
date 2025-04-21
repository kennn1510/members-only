const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const db = require("./db/db");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const homeRouter = require("./routes/home");
const signUpRouter = require("./routes/signup");
const authRouter = require("./routes/auth");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);
      if (!user) {
        return done(null, false, {message: "Incorrect username"});
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, {message: "Incorrect password"});
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use("/signup", signUpRouter);
app.use("/login", authRouter);
app.use("/logout", authRouter);
app.use("/", homeRouter);

app.listen(3000, () => console.log("App server listening on port 3000"));
