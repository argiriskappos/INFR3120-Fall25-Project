<<<<<<< HEAD
=======
// server.js (FIXED: Added Session Middleware)

>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc
const express = require("express");
const path = require("path");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const truckRoutes = require('./routes/TruckRoutes');
<<<<<<< HEAD
const session = require('express-session');
=======
const session = require('express-session'); // <-- NEW: Import session module
>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_strong_fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        secure: false
    }
}));

// ✅ Make session user available in ALL EJS files
app.use((req, res, next) => {
    res.locals.User = req.session.User || null;
    next();
});
=======
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CONFIGURE SESSION MIDDLEWARE
// This makes req.session available and must be placed before app.use
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_strong_fallback_secret',
    resave: false,
    saveUninitialized: false, 
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // Session lasts 24 hours
        secure: false // Set to true if using HTTPS
    } 
}));

>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

<<<<<<< HEAD
// Routes
app.use('/', truckRoutes);

// Home route
app.get(["/", "/index"], (req, res) => {
    res.render("index", {
        title: "Truck Management Home",
        activePage: "home"
=======
// ROUTES
app.use('/', truckRoutes);

// HOME ROUTE
app.get(["/", "/index"], (req, res) => {
    res.render("index", {
        title: "Truck Management Home",
        activePage: "home",
        // Pass User variable to EJS 
        User: req.session?.User || null
>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Running on http://localhost:${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc
