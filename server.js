const express = require("express");
const path = require("path");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const truckRoutes = require('./routes/TruckRoutes');
const session = require('express-session');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_strong_fallback_secret',
    resave: false,
    saveUninitialized: false, 
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24,
        secure: false
    } 
}));

//  available in ALL EJS files
app.use((req, res, next) => {
    res.locals.User = req.session.User || null;
    next();
});

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use('/', truckRoutes);

// Home route
app.get(["/", "/index"], (req, res) => {
    res.render("index", {
        title: "Truck Management Home",
        activePage: "home"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Running on http://localhost:${PORT}`);
});
