// server.js (Corrected)

const express = require("express");
const path = require("path");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const truckRoutes = require('./routes/TruckRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use('/', truckRoutes);

// HOME ROUTE
app.get(["/index"], (req, res) => {
    res.render("index", {
        title: "Truck Management Home",
        activePage: "home",
        // Pass User variable to EJS
        User: req.session?.User || null
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Running on http://localhost:${PORT}`);
});