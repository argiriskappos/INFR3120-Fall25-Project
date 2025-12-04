const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const truckRoutes = require("./routes/TruckRoutes");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");

// Env
dotenv.config();

// DB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Passport config
require("./config/passport")(passport);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// User to all EJS templates
app.use((req, res, next) => {
  res.locals.User = req.user || null;
  next();
});

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    req.session.User = req.user;
    res.redirect("/");
  }
);

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// App routes
app.use("/", truckRoutes);

// Home page
app.get(["/", "/index"], (req, res) => {
  res.render("index", {
    title: "Truck Management Home",
    activePage: "home"
  });
});

const User = require("./models/User");

// Forgot Password Page
app.get("/forgot-password", (req, res) => {
  res.render("forgotPassword", { error: null });
});

// Check Email Exists
app.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.render("forgotPassword", { error: "No account found with that email." });
  }

  // Render reset password page with userId
  res.render("resetPassword", { userId: user._id, error: null });
});

// Reset User Password
app.post("/reset-password", async (req, res) => {
  const { userId, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.render("resetPassword", { userId, error: "Passwords do not match." });
  }

  if (newPassword.length < 6) {
    return res.render("resetPassword", { userId, error: "Password must be at least 6 characters long." });
  }

  await User.findByIdAndUpdate(userId, { password: newPassword });

  return res.redirect("/login");
});

// Start
app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
