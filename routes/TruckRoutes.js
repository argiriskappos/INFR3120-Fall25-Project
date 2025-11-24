const express = require('express');
const router = express.Router();

// Import the Truck Model and User model
const Truck = require('../model/Truck'); 

const User = require('../model/User'); 


// Show the form page where the user can sign up
router.get('/SignUp', (req, res) => {
    res.render('SignUp', { 
        title: 'User Registration', 
        activePage: 'SignUp',
        error: null // Initialize error variable for EJS
    });
});

// Handle user registration submission //
router.post('/signup', async (req, res) => {
    try {
        // Create the new user document using the Mongoose model
        const newUser = await User.create(req.body);

        console.log(`New user registered: ${newUser.email}`);
        
        // Bring users to the home pageafter successful sign-up.
        res.redirect('/index.ejs'); 

    } catch (err) {
        let errorMessage = 'Registration failed. Please check your inputs.';

        // Handle specific MongoDB/Mongoose errors
        if (err.code === 11000) {
            errorMessage = 'An account with this email already exists.';
        } else if (err.errors) {
            const validationKeys = Object.keys(err.errors);
            errorMessage = err.errors[validationKeys[0]].message || errorMessage;
        } else {
            errorMessage = err.message || errorMessage;
        }

        // Re-render the sign-up form with the error message
        res.render('SignUp', {
            title: 'User Registration', 
            activePage: 'signup',
            error: errorMessage
        });
    }
});

// Show the form page where the user can create a truck//
router.get('/create', (req, res) => {
    res.render('create', { 
        title: 'Register New Truck/Unit', 
        activePage: 'create'
    });
});


// Save a new truck when the form is submitted //
router.post('/create', async (req, res) => {
    try {
        // Create a new truck using the form data
        const newTruck = new Truck({
            tripName: req.body.tripName,
            truckId: req.body.truckId,
            driverName: req.body.driverName,
            scheduledDeparture: req.body.scheduledDeparture,
            estimatedArrival: req.body.estimatedArrival,
            cargoType: req.body.cargoType,
            weightKg: req.body.weightKg,
            manifestSummary: req.body.manifestSummary,
            status: "Scheduled"
        });

        // Save the new truck
        await newTruck.save();

        // Go back to the trucks page
        res.redirect('/trucks');

    } catch (err) {
        console.error("Error saving truck:", err);
        res.status(400).send("Error: " + err.message);
    }
});


// Show all trucks in a table //
router.get('/trucks', async (req, res) => {
    try {
        // Get all trucks (newest first)
        const trucks = await Truck.find().sort({ createdAt: -1 });

        // Send the trucks to the page
        res.render('trucks', {
            title: 'Tracked Trucks',
            activePage: 'trucks',
            trucks
        });
    } catch (err) {
        console.error('Error fetching trucks:', err);
        res.status(500).send('Error loading tracked trucks.');
    }
});


// temporary page for requests
router.get('/requests', (req, res) => {
    res.send('<h1>Truck Requests List Page</h1><p>Work in progress. This route will show all truck requests.</p>');
});


// Load one truck so the user can edit it
router.get('/requests/:id', async (req, res) => {
    try {
        // Find the truck by its ID
        const trip = await Truck.findById(req.params.id);

        // If nothing found
        if (!trip) {
            return res.status(404).send('Trip not found');
        }

        // Show the edit page with that truck's data
        res.render('edit', { 
            trip,
            title: `Edit Truck Request: ${trip.id}`,
            activePage: 'trucks'
        });
    } catch (err) {
        console.error('Error loading trip for editing:', err);
        res.status(500).send('Error loading trip.');
    }
});


// Save the changes made to a truck after editing 
router.post('/requests/:id', async (req, res) => {
    try {
        // Update the truck with new form data
        await Truck.findByIdAndUpdate(req.params.id, req.body);

        // Go back to the trucks page
        res.redirect('/trucks');
    } catch (err) {
        console.error('Error updating truck:', err);
        res.status(500).send('Error updating truck.');
    }
});


module.exports = router;