<<<<<<< HEAD
=======
// TruckRoutes.js

>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc
const express = require('express');
const router = express.Router();

// Import the Truck Model and User model
const Truck = require('../model/Truck');
<<<<<<< HEAD
const User = require('../model/User');


// ==============================
// SIGN UP ROUTES (ORIGINAL)
// ==============================

=======

const User = require('../model/User');


>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc
// Show the form page where the user can sign up
router.get('/SignUp', (req, res) => {
    res.render('SignUp', {
        title: 'User Registration',
        activePage: 'SignUp',
        error: null // Initialize error variable for EJS
    });
});

// Handle user registration submission
router.post('/signup', async (req, res) => {
    try {
        // Create the new user document using the Mongoose model
        const newUser = await User.create(req.body);

        console.log(`New user registered: ${newUser.email}`);

        // This line now successfully sets the session data
        req.session.User = {
            _id: newUser._id,
            fullName: newUser.fullName, 
            role: newUser.role,
        };
        
        // Bring users to the home page after successful sign-up.
        res.redirect('/'); 

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

<<<<<<< HEAD

// ==============================
// ✅ ADDED: LOGIN ROUTES
// ==============================

// Show login form
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        activePage: 'login',
        error: null
    });
});

// Handle login submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', {
                title: 'Login',
                activePage: 'login',
                error: 'User not found'
            });
        }

        // Plain text password check (add bcrypt later if needed)
        if (user.password !== password) {
            return res.render('login', {
                title: 'Login',
                activePage: 'login',
                error: 'Incorrect password'
            });
        }

        // Save user in session
        req.session.User = {
            _id: user._id,
            fullName: user.fullName,
            role: user.role
        };

        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.render('login', {
            title: 'Login',
            activePage: 'login',
            error: 'Login failed'
        });
    }
});

// ==============================
// ✅ ADDED: LOGOUT
// ==============================

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});


// ==============================
// TRUCK ROUTES (ORIGINAL)
// ==============================

=======
>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc
// Show the form page where the user can create a truck
router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Register New Truck/Unit',
        activePage: 'create'
    });
});


// Save a new truck when the form is submitted
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


<<<<<<< HEAD
// Show all trucks in a table
=======
// Show all trucks in a table //
>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc
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


<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> 6af3e4e48e344377c4212be65b365b2f3a47e0bc
