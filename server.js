const express = require("express");
const path = require("path");
const truckRoutes = require('./TruckRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup
app.set("view engine", "ejs");
// Use 'views' folder for EJS templates
app.set("views", path.join(__dirname, "views"));

// Static files (CSS, JS, Images)
// This makes files in the 'public' folder accessible via the root path 
app.use(express.static(path.join(__dirname, "public")));

//Route Handling

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