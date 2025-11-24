// server.js

const express = require("express");
const path = require("path");
// 1. Import dotenv to load environment variables (like MONGO_URI)
const dotenv = require('dotenv'); 
// 2. Import the database connection function
const connectDB = require('./config/db'); 

const truckRoutes = require('./routes/TruckRoutes'); 

// Load environment variables from .env file.
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Allows the app to parse incoming request bodies with URL-encoded payloads
app.use(express.urlencoded({ extended: true })); 
// Allows the app to parse incoming request bodies with JSON payloads
app.use(express.json());

// EJS setup
app.set("view engine", "ejs");
// Use 'views' folder for EJS templates
app.set("views", path.join(__dirname, "views"));

// Static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// --- Route Handling ---

// Apply the truck routes
app.use('/', truckRoutes); 

// Base Route
app.get("/", (req, res) => {
  res.render("index", {
      title: 'Truck Management Home',
      activePage: 'home'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Running on http://localhost:${PORT}`);
})