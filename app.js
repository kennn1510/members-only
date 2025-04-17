// Imports
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const homeRouter = require("./routes/home");
const signUpRouter = require("./routes/signup");
const authRouter = require("./routes/auth");

// App Initialization
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/signup", signUpRouter);
app.use("/login", authRouter);
app.use("/", homeRouter);

// App server listen on port
app.listen(3000, () => console.log("App server listening on port 3000"));
